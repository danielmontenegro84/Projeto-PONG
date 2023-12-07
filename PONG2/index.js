const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreTexto = document.querySelector('#scoreText');
const resetBtn = document.querySelector('#resetBtn');
const jogoWidth = gameBoard.width;
const jogoHeight = gameBoard.height;
const mesaBackground = 'black';
const corRaquete1 = 'white';
const corRaquete2 = 'white';
const corBolinha = 'white';
const bolinhaRaio = 8.5;
const velocidadeRaquete = 50;
let idIntervalo;
let velocidadeBolinha = 16;
let bolinhaX = jogoWidth / 2;
let bolinhaY = jogoHeight / 2;
let jogador1Score = 0;
let jogador2Score = 0;
let direcaoXBolinha = 1; // Adicionando esta linha
let direcaoYBolinha = 1; // Adicionando esta linha
let mySound = new Audio('sound-effects-library-coin.mp3');
let Congratulations = new Audio('aplausos.wav');

//para a função de partida com placar de 3 a 5
let escolhePontuacaoBtn = document.querySelector('#escolhePontuacaoBtn');
let partidaScore = null;

/*document.querySelector("#escolhePontuacao").addEventListener("click", function(event){
   event.preventDefault();
   partidaScore = parseInt(document.querySelector("#pontuacao").value);
   resetJogo();
   escolheScore();
});
*/

let raquete1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};

let raquete2 = {
  width: 25,
  height: 100,
  x: jogoWidth - 25,
  y: jogoHeight - 100,
};

window.addEventListener('keydown', mudarDirecao);
resetBtn.addEventListener('click', resetJogo);
escolhePontuacaoBtn.addEventListener('click', escolheScore);

jogoStart();
desenharRaquetes();

function jogoStart() {
  criaBolinha();
  proximaMarcacao();
}

function proximaMarcacao() {
  idIntervalo = setTimeout(() => {
    clearMesa();
    desenharRaquetes();
    moverBolinha();
    desenharBolinha(bolinhaX, bolinhaY);
    checarColisao();
    proximaMarcacao();
  }, 32);
}

// Para iniciar o loop de jogo:
// idIntervalo = requestAnimationFrame(proximaMarcacao);

function clearMesa() {
  ctx.fillStyle = mesaBackground;
  ctx.fillRect(0, 0, jogoWidth, jogoHeight);
}

function desenharRaquetes() {
  ctx.fillStyle = corRaquete1;
  ctx.fillRect(raquete1.x, raquete1.y, raquete1.width, raquete1.height);

  ctx.fillStyle = corRaquete2;
  ctx.fillRect(raquete2.x, raquete2.y, raquete2.width, raquete2.height);
}

function criaBolinha() {
  velocidadeBolinha = 5;
  if (Math.round(Math.random()) == 1) {
    direcaoXBolinha = 1;
  } else {
    direcaoXBolinha = -1;
  }
  if (Math.round(Math.random()) == 1) {
    direcaoYBolinha = 1;
  } else {
    direcaoYBolinha = -1;
  }
  bolinhaX = jogoWidth / 2;
  bolinhaY = jogoHeight / 2;
  desenharBolinha(bolinhaX, bolinhaY);
}

function moverBolinha() {
  bolinhaX += velocidadeBolinha * direcaoXBolinha;
  bolinhaY += velocidadeBolinha * direcaoYBolinha;
}

function desenharBolinha(bolinhaX, bolinhaY) {
  ctx.fillStyle = corBolinha;
  ctx.beginPath();
  ctx.arc(bolinhaX, bolinhaY, bolinhaRaio, 0, 2 * Math.PI);
  ctx.fill();
}

function checarColisao() {
  if (bolinhaY <= 0 + bolinhaRaio) {
    direcaoYBolinha *= -1;
  }
  if (bolinhaY >= jogoHeight - bolinhaRaio) {
    direcaoYBolinha *= -1;
  }
  if (bolinhaX <= 0) {
    jogador2Score += 1;
    atualizaScore();

    if (checkVencedor() === 'Jogador 2') {
      Congratulations.play();
      setTimeout(() => {
        alert(`Jogador 2 é o Vencedor!`);
        resetJogo();
      }, 200);
    }

    criaBolinha();
    return;
  }
  if (bolinhaX >= jogoWidth) {
    jogador1Score += 1;
    atualizaScore();

    if (checkVencedor() === 'Jogador 1') {
      Congratulations.play();
      setTimeout(() => {
        alert(`Jogador 1 é o Vencedor!`);
        resetJogo();
      }, 200);
    }

    criaBolinha();
    return;
  }
  if (bolinhaX <= raquete1.x + raquete1.width + bolinhaRaio) {
    if (bolinhaY > raquete1.y && bolinhaY < raquete1.y + raquete1.height) {
      bolinhaX = raquete1.x + raquete1.width + bolinhaRaio;
      direcaoXBolinha *= -1;
      velocidadeBolinha += 1;

      //efeito sonoro...
      mySound.play();
    }
  }
  if (bolinhaX >= raquete2.x - bolinhaRaio) {
    if (bolinhaY > raquete2.y && bolinhaY < raquete2.y + raquete2.height) {
      bolinhaX = raquete2.x - bolinhaRaio;
      direcaoXBolinha *= -1;
      velocidadeBolinha += 1;

      //efeito sonoro...
      mySound.play();
    }
  }
}

function checkVencedor() {
  let vencedor = null;

  if (partidaScore !== null) {
    // jogador ja escolheu uma pontuação limite

    if (jogador1Score === partidaScore) {
      vencedor = 'Jogador 1';
    } else if (jogador2Score === partidaScore) {
      vencedor = 'Jogador 2';
    }
  }
  return vencedor;
}

function mudarDirecao(event) {
  const teclaPressionada = event.keyCode;
  const raquete1Up = 87;
  const raquete1Down = 83;
  const raquete2Up = 79;
  const raquete2Down = 76;

  switch (teclaPressionada) {
    case raquete1Up:
      if (raquete1.y > 0) {
        raquete1.y -= velocidadeRaquete;
      }
      break;
    case raquete1Down:
      if (raquete1.y < jogoHeight - raquete1.height) {
        raquete1.y += velocidadeRaquete;
      }
      break;
    case raquete2Up:
      if (raquete2.y > 0) {
        raquete2.y -= velocidadeRaquete;
      }
      break;
    case raquete2Down:
      if (raquete2.y < jogoHeight - raquete2.height) {
        raquete2.y += velocidadeRaquete;
      }
      break;
  }
}

function atualizaScore() {
  scoreTexto.textContent = `${jogador1Score} : ${jogador2Score}`;

  //let player1 = `${jogador1Score}`;
  //let player2 = `${jogador2Score}`;

  //if (player1 >= '2' || player2 >= '2') {
  // console.log('Game Over');
  //}
}

function resetJogo() {
  jogador1Score = 0;
  jogador2Score = 0;
  raquete1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };
  raquete2 = {
    width: 25,
    height: 100,
    x: jogoWidth - 25,
    y: jogoHeight - 100,
  };
  velocidadeBolinha = 1;
  bolinhaX = 0;
  bolinhaY = 0;
  direcaoXBolinha = 0;
  direcaoYBolinha = 0;
  atualizaScore();
  clearInterval(idIntervalo);
  jogoStart();
}

//function escolheScore(){

/*let player1 = `${jogador1Score}`;
   let player2 = `${jogador2Score}`;

   if ((player1 >= "2") || (player2 >= "2")){
      console.log("Game Over");
   }
}*/
/*
   resetJogo();
   let partidaScore = parseInt(document.getElementById("pontuacao").value);
   //console.log("Pontuação selecionada: ", String(partidaScore));
   // let partidaScore = ("#escolhePontuacaoBtn").valueOf;
   //resetJogo();
   if(partidaScore < 1 || partidaScore > 3){
      console.log("Essa pontuação ainda não é suportada pelo programa");
   }
   else{
      
      //while(partidaScore < jogador1Score && partidaScore < jogador2Score){
         if(partidaScore === jogador1Score){
            Congratulations.play();
            //freezeGame(); não implementado por enquanto..
            clearInterval(idIntervalo);
            console.log("Parabéns, Jogador 1!");
         }
         else if(partidaScore === jogador2Score){
            Congratulations.play();
            //freezeGame(); não implementado por enquanto..
            clearInterval(idIntervalo);
            console.log("Parabéns, Jogador 2!");
         }
      }
      */

function escolheScore() {
  partidaScore = parseInt(document.getElementById('pontuacao').value);
  resetJogo();
}
