  const cvs = document.getElementById("tetris"); //le canvas

const ctx = cvs.getContext("2d");//pour la création des tretominoes

const scoreElement = document.getElementById("score");

const row = 20;

const col = colonne = 10;

const tc = tailleCarre = 20;

const vacant = "black"; //couleur des carrés sans rien

// dessiner un carré
function dessinCarre(x,y,color){
    ctx.fillStyle = color;//travail de la couleur dans un canvas
    ctx.fillRect(x*tc,y*tc,tc,tc);

    ctx.strokeStyle = "black";
    ctx.strokeRect(x*tc,y*tc,tc,tc);
}

// creer un tableau

var tableau = [];
for( r = 0; r <row; r++){
    tableau[r] = [];
    for(c = 0; c < col; c++){
        tableau[r][c] = vacant;
    }
}

//dessiner le tableau
function dessinTableau(){
    for( r = 0; r <row; r++){
        for(c = 0; c < col; c++){
           dessinCarre(c,r,tableau[r][c]);
        }
    }
}

dessinCarre();

// donner couleurs aux tetrominoes

const pieces = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// générer les tetrominoes de façon aléatoire

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * pieces.length) // 0 -> 6
    return new piece( pieces[r][0],pieces[r][1]);
}

var p = randomPiece();

//l'objet pièce

function piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // commencer du 1er motif
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // controle des pièces
    this.x = 3;
    this.y = -2;
}

// remplir

piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //dessiner dans les carrés occupés
            if( this.activeTetromino[r][c]){
                dessinCarre(this.x + c,this.y + r, color);
            }
        }
    }
}

// dessiner une pièce dans le tableau

piece.prototype.draw = function(){
    this.fill(this.color);
}

//dessiner une pièce


piece.prototype.unDraw = function(){
    this.fill(vacant);
}

// descendre la pièce

piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // bloquer la pièce et en générer une autre 
        this.lock();
        p = randomPiece();
    }
    
}

// bouger à droite
piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

//bouger à gauche
piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// tourner la pièce
piece.prototype.rotate = function(){
   var nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    var kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > col/2){
            // droite du mur
            kick = -1; // bouger la pièce sur la gauche
        }else{
            // gauche du ur
            kick = 1; // bouger la pièce sur la droite
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

var score = 0;

piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // sauter les cases vacantes 
            if( !this.activeTetromino[r][c]){
                continue;
            }
            //bloqué en haut = game over
            if(this.y + r < 0){
                alert("Game Over");
                // demande l'arrêt du jeu
                gameOver = true;
                break;
            }
            // vérouillage des pièces 
           tableau[this.y+r][this.x+c] = this.color;
        }
    }
    //suprimer les lignes
    for(r = 0; r < row; r++){
        var isRowFull = true;
        for( c = 0; c < col; c++){
            isRowFull = isRowFull && (tableau[r][c] != vacant);
        }
        if(isRowFull){
            //si la rangé est pleine
            // les lignes decendent
            for( y = r; y > 1; y--){
                for( c = 0; c < col; c++){
                    tableau[y][c] = tableau[y-1][c];
                }
            }
            // la 1ère ligne du tableau n'a rien desus
            for( c = 0; c < col; c++){
                tableau[0][c] = vacant;
            }
            // calcul scole
            score += 10;
        }
    }
    // maj tableau
    dessinTableau();
    
    //maj score
    scoreElement.innerHTML = score;
}

// collision

piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // isi le carré est vite, il faut le passer
            if(!piece[r][c]){
                continue;
            }
            // coordination de la pièce après mouvement
            var newX = this.x + c + x;
            var newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= col || newY >= row){
                return true;
            }
            
            
            if(newY < 0){
                continue;
            }
            // vérifier si pièce dejç vérouillée. 
            if( tableau[newY][newX] != vacant){
                return true;
            }
        }
    }
    return false;
}

// controler 

document.addEventListener("keydown", control);

function control(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

// bouger la pièce en seconde

var start = Date.now();
var gameOver = false;
function bouge(){
   var now = Date.now();
    var delta = now - start;
    if(delta > 1000){
        p.moveDown();
        start = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(bouge);
    }
}

bouge();











