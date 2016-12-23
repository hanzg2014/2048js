var board = new Array();
var score = 0
var hasConflicted = new Array();
	
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
    prepareForMobile();
	newgame();
});

function prepareForMobile(){
    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * cellSpace);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function generateOneNumber(){
	if(nospace(board)){
		return false;
	}
	//random position
	var randx = parseInt(Math.floor(Math.random() * 4))  //0~1 float by default
	var randy = parseInt(Math.floor(Math.random() * 4))
	
	//set a upper-limit for the times of random trials
	var times = 0;
	while(times < 50){
		if(board[randx][randy]==0){
			break;
		}
		else{
			var randx = parseInt(Math.floor(Math.random() * 4))  //0~1 float by default
			var randy = parseInt(Math.floor(Math.random() * 4))
		}
		times++;
	}

	//when the upper-limit is reached, assign the value wth the first vacant place of board
	if(times == 50){
		for(var i=0; i<4; i++){
        	for(var j=0; j<4; j++){
        		if(board[i][j]==0){
        			randx = i;
        			randy = j;
        		}
        	}
        }
	}

	//random number
	var randNumber = Math.random() < 0.5?2:4;

	//display the random number
	board[randx][randy]=randNumber;
	showNumberWithAnimation(randx,randy, randNumber);
	return true;
}

function newgame(){
	//initialize the board
	init();
	//randomly generate two cells
	generateOneNumber();
	generateOneNumber();

}

function init(){
	//alert("init");
    for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){
            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop(i,j));
            gridCell.css('left', getPosLeft(i,j));
        }
    }

    for(var i=0; i<4; i++){
    	board[i] = new Array();
    	hasConflicted[i] = new Array();
        for(var j=0; j<4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updataBoardView();
    score = 0;
}

function updataBoardView(){
	$('.number-cell').remove();
	for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){
        	$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')   
        	var theNumberCell = $('#number-cell-'+i+'-'+j);

        	if(board[i][j]==0){
        		theNumberCell.css('width','0px')
        		theNumberCell.css('height','0px')
        		theNumberCell.css('top', getPosTop(i,j)+0.5*cellSideLength)
        		theNumberCell.css('left', getPosLeft(i,j)+0.5*cellSideLength)
        	}
        	else{
        		theNumberCell.css('width', cellSideLength)
        		theNumberCell.css('height', cellSideLength)
        		theNumberCell.css('top', getPosTop(i,j))
        		theNumberCell.css('left', getPosLeft(i,j))
        		theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]))
        		theNumberCell.css('color', getNumberColor(board[i][j]))
        		theNumberCell.text(board[i][j])
        	}
        	//reset everytime updating
        	hasConflicted[i][j] = false;
        }
    }
    $('.number-cell').css('line-height',cellSideLength+'px')
    $('.number-cell').css('font-size',0.6*cellSideLength+'px')
}


$(document).keydown(function(event){
    //the default action is to scroll in different directions 
    
    //event.preventDefault();
	switch(event.keyCode){
		case 37: //left
            event.preventDefault();
			if(moveLeft()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",300);
			}
			break;
		case 38: //up
            event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",300);
			}
			break;
		case 39:  //right
            event.preventDefault();
			if(moveRight()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",300);
			}
			break;
		case 40: //down
            event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",300);
			}
			break;
		default: //default
			break;
	}
});


//event listener
//(event) stores the informations about the 'touchstart' event
document.addEventListener("touchstart",function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

//issue 19827
document.addEventListener("touchmove",function(event){
    event.preventDefault();
});

document.addEventListener("touchend",function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    var abs_deltax = Math.abs(deltax);
    var abs_deltay = Math.abs(deltay);

    //or, it will sometimes generate a new number when clicked on the screen
    if ((abs_deltax < 0.1*documentWidth)&&(abs_deltay < 0.1*documentWidth)){  
        return;
    }

    if(abs_deltax > abs_deltay){
        if(deltax > 0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",150);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()",150);
                setTimeout("isgameover()",300);
            }
        }
    }
    else{
        if(deltay > 0){
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()",150);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()",150);
                setTimeout("isgameover()",300);
            }
        }
    }
});

function isgameover(){
	if (nospace(board)&&nomove(board)){
		gameover();
	}
}

function gameover(){
	alert("Game Over!");
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}
	for(var i=0; i<4; i++){
        for(var j=1; j<4; j++){
        	if(board[i][j]!=0){
        		for(var k=0;k<j;k++){
        			if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
        				//move
        				showMoveAnimation(i,j,i,k);
        				board[i][k] = board[i][j];
        				board[i][j] = 0;
        				break;
        			}
        			else if((board[i][k]==board[i][j])&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
        				//move
        				showMoveAnimation(i,j,i,k);
        				//add
        				board[i][k]+=board[i][j];
        				board[i][j]=0;

        				//update score
        				score+=board[i][k];
        				updateScore(score);

        				//set hasConflicted
        				hasConflicted[i][k] = true;
        				break;
        			}
        		}
        	}
        }
    }
    setTimeout("updataBoardView()",200);
    return true;
}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}
	for(var i=0; i<4; i++){
        for(var j=2; j>=0; j--){
        	if(board[i][j]!=0){
        		for(var k=3;k>j;k--){
        			if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
        				//move
        				showMoveAnimation(i,j,i,k);
        				board[i][k] = board[i][j];
        				board[i][j] = 0;
        				break;
        			}
        			else if((board[i][k]==board[i][j])&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
        				//move
        				showMoveAnimation(i,j,i,k);
        				//add
        				board[i][k]+=board[i][j];
        				board[i][j]=0;

        				//update score
        				score+=board[i][k];
        				updateScore(score);

        				//set hasConflicted
        				hasConflicted[i][k] = true;
        				break;
        			}
        		}
        	}
        }
    }
    setTimeout("updataBoardView()",200);
    return true;
}

function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}
	for(var j=0; j<4; j++){
		for(var i=1; i<4; i++){
        	if(board[i][j]!=0){
        		for(var k=0;k<i;k++){
        			if(board[k][j]==0&&noBlockVertical(k,i,j,board)){
        				//move
        				showMoveAnimation(i,j,k,j);
        				board[k][j] = board[i][j];
        				board[i][j] = 0;
        				break;
        			}
        			else if((board[k][j]==board[i][j])&&noBlockVertical(k,i,j,board)&&!hasConflicted[k][j]){
        				//move
        				showMoveAnimation(i,j,k,j);
        				//add
        				board[k][j]+=board[i][j];
        				board[i][j]=0;

        				//update score
        				score+=board[k][j];
        				updateScore(score);

        				//set hasConflicted
        				hasConflicted[k][j] = true;
        				break;
        			}
        		}
        	}
        }
    }
    setTimeout("updataBoardView()",100);
    return true;
}

function moveDown(){
	if(!canMoveDown(board)){
		return false;
	}
	for(var j=0; j<4; j++){
		for(var i=2; i>=0; i--){
        	if(board[i][j]!=0){
        		for(var k=3;k>i;k--){
        			if(board[k][j]==0&&noBlockVertical(i,k,j,board)){
        				//move
        				showMoveAnimation(i,j,k,j);
        				board[k][j] = board[i][j];
        				board[i][j] = 0;
        				break;
        			}
        			else if((board[k][j]==board[i][j])&&noBlockVertical(i,k,j,board)&&!hasConflicted[k][j]){
        				//move
        				showMoveAnimation(i,j,k,j);
        				//add
        				board[k][j]+=board[i][j];
        				board[i][j]=0;

        				//update score
        				score+=board[k][j];
        				updateScore(score);

        				//set hasConflicted
        				hasConflicted[k][j] = true;
        				break;
        			}
        		}
        	}
        }
    }
    setTimeout("updataBoardView()",100);
    return true;
}
