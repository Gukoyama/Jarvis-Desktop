import * as THREE from "three";

import { EffectComposer }
from "three/addons/postprocessing/EffectComposer.js";

import {
    HandLandmarker,
    FilesetResolver,
    DrawingUtils
} from "@mediapipe/tasks-vision";

import { RenderPass }
from "three/addons/postprocessing/RenderPass.js";

import { UnrealBloomPass }
from "three/addons/postprocessing/UnrealBloomPass.js";

const cena = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 4.5;

const renderizador = new THREE.WebGLRenderer({
    antialias: true
});

renderizador.setSize(
    window.innerWidth,
    window.innerHeight
);

renderizador.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderizador.domElement);

// Qualidade das cores
renderizador.outputColorSpace =
    THREE.SRGBColorSpace;

renderizador.toneMapping =
    THREE.ACESFilmicToneMapping;

renderizador.toneMappingExposure = 0.9;

// Sistema de efeitos
const composer =
    new EffectComposer(renderizador);

const renderPass =
    new RenderPass(cena, camera);

composer.addPass(renderPass);

// Efeito de brilho Bloom
const bloomPass =
    new UnrealBloomPass(
        new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        ),
        0.5,  // força do brilho
        0.45,  // tamanho do brilho
        0.35  // limite do brilho
    );

composer.addPass(bloomPass);

// Grupo principal
const jarvis = new THREE.Group();
cena.add(jarvis);

// Jarvis começa desligado
jarvis.visible = true;

// Cor laranja
const corJarvis = 0xff9d45;

// Esfera central
const geometriaEsfera = new THREE.SphereGeometry(
    1.4,
    32,
    24
);

const materialEsfera = new THREE.MeshBasicMaterial({
    color: corJarvis,
    wireframe: true,
    transparent: true,
    opacity: 0.55
});

const esfera = new THREE.Mesh(
    geometriaEsfera,
    materialEsfera
);

jarvis.add(esfera);

// Material dos anéis
const materialAnel = new THREE.MeshBasicMaterial({
    color: corJarvis,
    transparent: true,
    opacity: 0.9
});

// Primeiro anel
const anel1 = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.015, 8, 150),
    materialAnel
);

jarvis.add(anel1);

// Segundo anel
const anel2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.015, 8, 150),
    materialAnel
);

anel2.rotation.x = Math.PI / 2.5;
anel2.rotation.y = Math.PI / 4;

jarvis.add(anel2);

// Terceiro anel
const anel3 = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.015, 8, 150),
    materialAnel
);

anel3.rotation.x = Math.PI / 3;
anel3.rotation.y = -Math.PI / 3;

jarvis.add(anel3);

// Partículas em volta da esfera
const quantidade = 1200;
const posicoes = [];

for (let i = 0; i < quantidade; i++) {
    const distancia = 1.3 + Math.random() * 1.3;

    const angulo1 = Math.random() * Math.PI * 2;
    const angulo2 = Math.acos(2 * Math.random() - 1);

    const x =
        distancia *
        Math.sin(angulo2) *
        Math.cos(angulo1);

    const y =
        distancia *
        Math.sin(angulo2) *
        Math.sin(angulo1);

    const z =
        distancia *
        Math.cos(angulo2);

    posicoes.push(x, y, z);
}

const geometriaParticulas =
    new THREE.BufferGeometry();

geometriaParticulas.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(posicoes, 3)
);

const materialParticulas =
    new THREE.PointsMaterial({
        color: corJarvis,
        size: 0.025,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

const particulas = new THREE.Points(
    geometriaParticulas,
    materialParticulas
);

jarvis.add(particulas);

// Movimento do mouse
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", function(evento) {
    mouseX =
        evento.clientX / window.innerWidth - 0.5;

    mouseY =
        evento.clientY / window.innerHeight - 0.5;
});

// Linhas de energia
const linhasEnergia = new THREE.Group();

for (let linha = 0; linha < 9; linha++) {
    const pontos = [];

    for (let i = 0; i <= 80; i++) {
        const angulo = (i / 80) * Math.PI * 2;

        const ruido =
            (Math.random() - 0.5) * 0.25;

        const raio = 2.3 + ruido;

        const x = Math.cos(angulo) * raio;
        const y =
            Math.sin(angulo) * raio * 0.55;
        const z =
            (Math.random() - 0.5) * 0.15;

        pontos.push(
            new THREE.Vector3(x, y, z)
        );
    }

    const geometriaLinha =
        new THREE.BufferGeometry()
            .setFromPoints(pontos);

    const materialLinha =
        new THREE.LineBasicMaterial({
            color: corJarvis,
            transparent: true,
            opacity: 0.08 + Math.random() * 0.15
        });

    const energia = new THREE.Line(
        geometriaLinha,
        materialLinha
    );

    energia.rotation.x =
        Math.random() * Math.PI;

    energia.rotation.y =
        Math.random() * Math.PI;

    linhasEnergia.add(energia);
}

jarvis.add(linhasEnergia);

// Núcleo de energia
const geometriaNucleo =
    new THREE.SphereGeometry(0.35, 32, 32);

const materialNucleo =
    new THREE.MeshBasicMaterial({
        color: 0xffd6a0,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

const nucleo = new THREE.Mesh(
    geometriaNucleo,
    materialNucleo
);

jarvis.add(nucleo);

// Aura ao redor do núcleo
const geometriaAura =
    new THREE.SphereGeometry(0.6, 32, 32);

const materialAura =
    new THREE.MeshBasicMaterial({
        color: 0xff7b00,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const aura = new THREE.Mesh(
    geometriaAura,
    materialAura
);

jarvis.add(aura);

const materialOnda = new THREE.MeshBasicMaterial({
    color: 0xff9d45,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const ondaEnergia = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 20, 20),
    materialOnda
);

jarvis.add(ondaEnergia);

// Camada externa de energia
const geometriaExterna =
    new THREE.IcosahedronGeometry(1.65, 3);

const materialExterno =
    new THREE.MeshBasicMaterial({
        color: 0xff6a00,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const camadaExterna = new THREE.Mesh(
    geometriaExterna,
    materialExterno
);

jarvis.add(camadaExterna);

// Camada interna
const geometriaInterna =
    new THREE.IcosahedronGeometry(1.05, 2);

const materialInterno =
    new THREE.MeshBasicMaterial({
        color: 0xffd6a0,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });

const camadaInterna = new THREE.Mesh(
    geometriaInterna,
    materialInterno
);

jarvis.add(camadaInterna);

function mudarCorJarvis(cor) {
    jarvis.traverse(function(objeto) {
        if (objeto.material && objeto.material.color) {
            objeto.material.color.setHex(cor);
        }
    });
}

// Estado inicial
mudarCorJarvis(0xffffff);
jarvis.scale.set(0.25, 0.25, 0.25);

nucleo.visible = false;
aura.visible = false;
esfera.visible = false;

anel1.visible = false;
anel2.visible = false;
anel3.visible = false;
linhasEnergia.visible = false;
camadaExterna.visible = false;
camadaInterna.visible = false;
ondaEnergia.visible = false;



   let jarvisAtivo = false;

const relogio = new THREE.Clock();

// Animação
function animar() {
    requestAnimationFrame(animar);

     const tempo = relogio.getElapsedTime();

    const onda = (tempo * 0.5) % 1;

    ondaEnergia.scale.setScalar(1 + onda * 2);
    materialOnda.opacity = 0.5 * (1 - onda);

     
     jarvis.position.y =
    0.55 + Math.sin(tempo * 1.2) * 0.06;

     const pulsoNucleo =
    1 + Math.sin(tempo * 5) * 0.15;

nucleo.scale.setScalar(pulsoNucleo);

aura.scale.setScalar(
    1.2 + Math.sin(tempo * 4) * 0.25
);

materialAura.opacity =
    0.15 + Math.sin(tempo * 4) * 0.08;

    const pulso = 
        1 + Math.sin(tempo * 3) * 0.05;

    esfera.scale.setScalar(pulso);

    if (jarvisAtivo) {
    // Ativado: pulsação rápida
    particulas.scale.setScalar(
        1 + Math.sin(tempo * 3) * 0.03
    );

    materialParticulas.opacity = 0.8;
} else {
    // Desativado: pulsação lenta
    particulas.scale.setScalar(
        1 + Math.sin(tempo * 1.5) * 0.1
    );

    materialParticulas.opacity =
        0.6 + Math.sin(tempo * 1.5) * 0.2;
}

    materialEsfera.opacity =
    0.45 + Math.sin(tempo * 3) * 0.15;

    esfera.rotation.y += 0.003;
    esfera.rotation.x += 0.001;

    anel1.rotation.z += 0.007;
    anel2.rotation.z -= 0.005;
    anel3.rotation.z += 0.004;

    linhasEnergia.rotation.x += 0.001;
    linhasEnergia.rotation.y -= 0.002;
    linhasEnergia.rotation.z += 0.001;

    particulas.rotation.y -= 0.002;

    camadaExterna.rotation.x += 0.001;
camadaExterna.rotation.y -= 0.003;

camadaInterna.rotation.x -= 0.004;
camadaInterna.rotation.z += 0.003;

camadaExterna.scale.setScalar(
    1 + Math.sin(tempo * 2) * 0.04
);

camadaInterna.scale.setScalar(
    1 + Math.sin(tempo * 4) * 0.07
);

    jarvis.rotation.y +=
        (mouseX * 0.8 - jarvis.rotation.y) * 0.03;

    jarvis.rotation.x +=
        (-mouseY * 0.8 - jarvis.rotation.x) * 0.03;

    jarvis.scale.lerp(escalaDestino, 0.08);

    // Faz a rotação inicial parar suavemente
    jarvis.rotation.z *= 0.94;

    // Brilho dinâmico
if (jarvisAtivo) {
    bloomPass.strength =
        0.5 + Math.sin(tempo * 2) * 0.08;
} else {
    bloomPass.strength =
        0.25 + Math.sin(tempo * 1.5) * 0.05;
}

    composer.render();
}

// Tamanho desejado do Jarvis
const escalaDestino =
    new THREE.Vector3(0.25, 0.25, 0.25);

// Pulso ao clicar
window.addEventListener("click", function() {
    // Desativado: clicar não faz nada
    if (!jarvisAtivo) {
        return;
    }

    escalaDestino.set(1.25, 1.25, 1.25);

    materialNucleo.color.set(0xffffff);
    materialEsfera.color.set(0xffd6a0);

    setTimeout(function() {
        escalaDestino.set(1, 1, 1);

        materialNucleo.color.set(0xffd6a0);
        materialEsfera.color.set(corJarvis);
    }, 250);
});


animar();

// Corrige o tamanho ao redimensionar a tela
window.addEventListener("resize", function() {
    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderizador.setSize(
        window.innerWidth,
        window.innerHeight
    );

     composer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

const campoComando =
    document.getElementById("comando");

const botaoExecutar =
    document.getElementById("executar");

const resposta =
    document.getElementById("resposta");

let cronometroFoco = null;

async function executarComando() {
    const comando = campoComando.value
        .trim()
        .toLowerCase();

        if (!jarvisAtivo) {
    resposta.textContent =
        "ATIVE O JARVIS PRIMEIRO.";

    return;
}

    if (
    comando.includes("hbo") ||
    comando.includes("max")
) {
        resposta.textContent =
            "ABRINDO HBO MAX...";

        window.open(
            "https://www.max.com/",
            "_blank"
        );

            setTimeout(function() {
    resposta.textContent =
        "JARVIS ATIVADO. SISTEMA ONLINE.";
}, 3000);

    } 

  else if (
    comando.includes("youtube") ||
    comando.includes("you tube")
) {
    resposta.textContent =
        "ABRINDO YOUTUBE...";

    window.open(
        "https://www.youtube.com/",
        "_blank"
    );

        setTimeout(function() {
    resposta.textContent =
        "JARVIS ATIVADO. SISTEMA ONLINE.";
}, 3000);
}
    else if (comando.includes("abrir google")) {
    resposta.textContent =
        "ABRINDO GOOGLE...";

    window.open(
        "https://www.google.com/",
        "_blank"
    );

        setTimeout(function() {
    resposta.textContent =
        "JARVIS ATIVADO. SISTEMA ONLINE.";
}, 3000);
}

    else if (comando.startsWith("pesquisar ")) {
    const pesquisa = comando.replace(
        "pesquisar ",
        ""
    );

    resposta.textContent =
        "PESQUISANDO " + pesquisa.toUpperCase() + "...";

    window.open(
        "https://www.google.com/search?q=" +
        encodeURIComponent(pesquisa),
        "_blank"
    );

    setTimeout(function() {
    resposta.textContent =
        "JARVIS ATIVADO. SISTEMA ONLINE.";
}, 3000);

}

    else if (
    comando.includes("hora")
) {
    const agora = new Date();

    const horario = agora.toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

    resposta.textContent =
        `AGORA SÃO ${horario}.`;


    setTimeout(function() {
        resposta.textContent =
            "JARVIS ATIVADO. SISTEMA ONLINE.";
    }, 10000);

}

    else if (comando.includes("data")) {
    const hoje = new Date();

    const dataAtual = hoje.toLocaleDateString(
        "pt-BR"
    );

    resposta.textContent =
        `HOJE É ${dataAtual}.`;

    setTimeout(function() {
        resposta.textContent =
            "JARVIS ATIVADO. SISTEMA ONLINE.";
    }, 10000);
}

else if (comando === "abrir steam") {
    resposta.textContent = "ABRINDO STEAM...";

    if (window.jarvisPC) {
        window.jarvisPC.abrirPrograma("steam");
    } else {
        resposta.textContent =
            "ESTE COMANDO FUNCIONA SOMENTE NO APLICATIVO.";
    }

      setTimeout(function() {
    resposta.textContent =
        "JARVIS ATIVADO. SISTEMA ONLINE.";
    }, 3000);

}

    else if (comando === "abrir calculadora") {
    resposta.textContent = "ABRINDO CALCULADORA...";

    if (window.jarvisPC) {
        window.jarvisPC.abrirPrograma("calculadora");
    } else {
        resposta.textContent =
            "ESTE COMANDO FUNCIONA SOMENTE NO APLICATIVO.";
    }
         setTimeout(function() {
    resposta.textContent =
        "JARVIS ATIVADO. SISTEMA ONLINE.";
    }, 3000);
}

else if (comando === "abrir cmd") {
    resposta.textContent = "ABRINDO CMD...";

    if (window.jarvisPC) {
        window.jarvisPC.abrirPrograma("cmd");
    } else {
        resposta.textContent =
            "ESTE COMANDO FUNCIONA SOMENTE NO APLICATIVO.";
    }

            setTimeout(function() {
    resposta.textContent =
        "JARVIS ATIVADO. SISTEMA ONLINE.";
    }, 3000);
    
}

else if (
    comando === "status do sistema" ||
    comando === "status"
) {
    resposta.textContent = "ANALISANDO SISTEMA...";

    if (window.jarvisPC) {
        const dados =
            await window.jarvisPC.obterStatus();

        resposta.innerHTML = `
           SISTEMA: ${ dados.sistema === "win32"
        ? "WINDOWS"
        : dados.sistema
}<br>
            PROCESSADOR: ${dados.processador}<br>
            NÚCLEOS: 6<br>
            THREADS: ${dados.nucleos}<br>
            RAM: ${dados.ramUsada} GB /
            ${dados.ramTotal} GB<br>
            TEMPO LIGADO: ${dados.tempoLigado} HORAS<br>
            INTERNET: ${
                navigator.onLine
                    ? "CONECTADA"
                    : "DESCONECTADA"
            }
        `;
    } else {
        resposta.textContent =
            "FUNCIONA SOMENTE NO APLICATIVO.";
    }

             /* setTimeout(function() {
    resposta.textContent =
        "JARVIS ATIVADO. SISTEMA ONLINE.";
    }, 3000); */
}

    else if (
    comando === "modo dev" ||
    comando === "modo desenvolvedor"
) {
    resposta.textContent =
        "INICIANDO MODO DESENVOLVEDOR...";

    if (window.jarvisPC) {
        await window.jarvisPC.abrirPrograma("modo-dev");

        resposta.textContent =
            "MODO DESENVOLVEDOR ATIVADO.";
    } else {
        resposta.textContent =
            "FUNCIONA SOMENTE NO APLICATIVO.";
    }
}

    else if (
    comando === "ajuda" ||
    comando === "comandos"
) {
    resposta.innerHTML = `
        COMANDOS DO JARVIS:<br><br>

        • hora<br>
        • data<br>
        • status<br>
        • modo dev<br>
        • abrir YouTube<br>
        • abrir HBO Max<br>
        • abrir Google<br>
        • abrir Steam<br>
        • abrir calculadora<br>
        • abrir CMD
    `;
}

    else if (comando.startsWith("focar ")) {
    const minutos = Number(
        comando.replace("focar ", "")
    );

    if (
        !Number.isInteger(minutos) ||
        minutos < 1 ||
        minutos > 120
    ) {
        resposta.textContent =
            "DIGITE: focar 1 até focar 120";
        return;
    }

    clearInterval(cronometroFoco);

    let segundos = minutos * 60;

    function mostrarTempo() {
        const min = Math.floor(segundos / 60);
        const seg = segundos % 60;

        resposta.textContent =
            `MODO FOCO: ${min}:${String(seg).padStart(2, "0")}`;
    }

    mostrarTempo();

    cronometroFoco = setInterval(function() {
        segundos--;

        if (segundos <= 0) {
            clearInterval(cronometroFoco);
            cronometroFoco = null;

            resposta.textContent =
                "TEMPO FINALIZADO! BOM TRABALHO.";
            return;
        }

        mostrarTempo();
    }, 1000);
}
   
else if (comando === "") {
        resposta.textContent =
            "Digite um comando.";

    } else {
        resposta.textContent =
            "Comando não reconhecido.";
    }

    campoComando.value = "";
}

botaoExecutar.addEventListener(
    "click",
    function(evento) {
        evento.stopPropagation();
        executarComando();
    }
);

// Executa também ao apertar Enter
campoComando.addEventListener(
    "keydown",
    function(evento) {
        if (evento.key === "Enter") {
            executarComando();
        }
    }
);

const botaoAtivar =
    document.getElementById("ativar");

const botaoDesativar =
    document.getElementById("desativar");

botaoAtivar.addEventListener(
    "click",
    function(evento) {
        evento.stopPropagation();
        jarvisAtivo = true;

        mudarCorJarvis(0xff9d45);

        // Cores diferentes para criar profundidade
materialNucleo.color.set(0xffffff);
materialAura.color.set(0xff6a00);
materialEsfera.color.set(0xffb347);
materialParticulas.color.set(0xff8c32);
materialAnel.color.set(0xffc266);
materialExterno.color.set(0xff6a00);
materialInterno.color.set(0xffd6a0);
materialOnda.color.set(0xff9d45);

        nucleo.visible = true;
aura.visible = true;
esfera.visible = true;
        anel1.visible = true;
anel2.visible = true;
anel3.visible = true;
linhasEnergia.visible = true;
camadaExterna.visible = true;
camadaInterna.visible = true;
ondaEnergia.visible = true;

        jarvis.visible = true;

        // Começa pequeno e girado
        jarvis.scale.set(0.01, 0.01, 0.01);
        jarvis.rotation.z = -Math.PI * 2;

        // Cresce até o tamanho normal
        escalaDestino.set(1, 1, 1);

        materialNucleo.color.set(0xffffff);

        resposta.textContent =
            "INICIANDO SISTEMA...";

        setTimeout(function() {
            materialNucleo.color.set(0xffd6a0);

            resposta.textContent =
                "JARVIS ATIVADO. SISTEMA ONLINE.";
        }, 1200);
    }
);

botaoDesativar.addEventListener("click", function(evento) {
    evento.stopPropagation();

    jarvisAtivo = false;

    escalaDestino.set(0.25, 0.25, 0.25);
    mudarCorJarvis(0xffffff);

    nucleo.visible = false;
aura.visible = false;
esfera.visible = false;
    anel1.visible = false;
anel2.visible = false;
anel3.visible = false;
linhasEnergia.visible = false;
camadaExterna.visible = false;
camadaInterna.visible = false;
ondaEnergia.visible = false;

    resposta.textContent = "DESLIGANDO SISTEMA...";

    setTimeout(function() {
        mudarCorJarvis(0xffffff);
        resposta.textContent = "JARVIS DESATIVADO.";
    }, 600);
});

const videoCamera =
    document.getElementById("camera");

const statusCamera =
    document.getElementById("status-camera");

    const canvasMao =
    document.getElementById("pontos-mao");

const contextoMao =
    canvasMao.getContext("2d");

const desenhoMao =
    new DrawingUtils(contextoMao);

let ultimoTempoCamera = -1;

let detectorMao = null;

async function prepararDetectorMao() {
    statusCamera.textContent =
        "CARREGANDO DETECTOR DE MÃOS...";

    const vision =
        await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
        );

    detectorMao =
        await HandLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
                    delegate: "CPU"
                },

                runningMode: "VIDEO",
                numHands: 2,

                minHandDetectionConfidence: 0.5,
                minHandPresenceConfidence: 0.5,
                minTrackingConfidence: 0.5
            }
        );
}

    let aguardandoMaoAberta = false;
    let tempoMaoFechada = 0;
    let aguardandoMaoFechada = false;
    let tempoMaoAberta = 0;
    let bloquearGestosAte = 0;

function verificarMaoAberta(pontos) {
    return (
        pontos[8].y < pontos[6].y &&
        pontos[12].y < pontos[10].y &&
        pontos[16].y < pontos[14].y &&
        pontos[20].y < pontos[18].y
    );
}

function verificarMaoFechada(pontos) {
    return (
        pontos[8].y > pontos[6].y &&
        pontos[12].y > pontos[10].y &&
        pontos[16].y > pontos[14].y &&
        pontos[20].y > pontos[18].y
    );
}

function detectarMaos() {
    if (
        detectorMao &&
        videoCamera.readyState >= 2 &&
        videoCamera.currentTime !== ultimoTempoCamera
    ) {
        ultimoTempoCamera = videoCamera.currentTime;

        const resultado = detectorMao.detectForVideo(
            videoCamera,
            performance.now()
        );

        contextoMao.clearRect(
            0,
            0,
            canvasMao.width,
            canvasMao.height
        );

        for (const pontos of resultado.landmarks) {
            desenhoMao.drawConnectors(
                pontos,
                HandLandmarker.HAND_CONNECTIONS,
                {
                    color: "#ff9d45",
                    lineWidth: 4
                }
            );

            desenhoMao.drawLandmarks(
                pontos,
                {
                    color: "#ffffff",
                    lineWidth: 2,
                    radius: 4
                }
            );
        }

        if (resultado.landmarks.length > 0) {
            const primeiraMao = resultado.landmarks[0];

            if (!jarvisAtivo) {
                if (verificarMaoFechada(primeiraMao)) {
                    aguardandoMaoAberta = true;
                    tempoMaoFechada = Date.now();

                    statusCamera.textContent =
                        "✊ ABRA A MÃO PARA ATIVAR";
                }

                const movimentoValido =
                    aguardandoMaoAberta &&
                    Date.now() - tempoMaoFechada < 3000 &&
                    verificarMaoAberta(primeiraMao);

                if (movimentoValido) {
                    aguardandoMaoAberta = false;

                    statusCamera.textContent =
                        "🖐 ATIVANDO JARVIS...";

                    botaoAtivar.click();
                }

                if (Date.now() - tempoMaoFechada >= 3000) {
                    aguardandoMaoAberta = false;
                }
            } else {
    if (verificarMaoAberta(primeiraMao)) {
        aguardandoMaoFechada = true;
        tempoMaoAberta = Date.now();

        statusCamera.textContent =
            "🖐 FECHE A MÃO PARA DESATIVAR";
    }

    const desativarValido =
        aguardandoMaoFechada &&
        Date.now() - tempoMaoAberta < 3000 &&
        verificarMaoFechada(primeiraMao);

    if (desativarValido) {
        aguardandoMaoFechada = false;
        bloquearGestosAte = Date.now() + 2000;

        statusCamera.textContent =
            "✊ DESATIVANDO JARVIS...";

        botaoDesativar.click();
    }

    if (Date.now() - tempoMaoAberta >= 3000) {
        aguardandoMaoFechada = false;
    }
}
        } else {
            statusCamera.textContent =
                "CÂMERA ATIVA — MOSTRE A MÃO";
        }
    }

    requestAnimationFrame(detectarMaos);
}
 
async function iniciarCamera() {
    try {
        statusCamera.textContent =
            "INICIANDO CÂMERA...";

        const cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: "user"
                },
                audio: false
            });

        videoCamera.srcObject = cameraStream;

        statusCamera.textContent =
            "CÂMERA ATIVA — LIBRAS";
            detectarMaos();
    } catch (erro) {
        console.error(erro);

        statusCamera.textContent =
            "ERRO: PERMISSÃO DA CÂMERA";
    }
}

async function iniciarSistemaLibras() {
    try {
        await prepararDetectorMao();
        await iniciarCamera();
    } catch (erro) {
        console.error(erro);

        statusCamera.textContent =
            "ERRO AO CARREGAR DETECTOR";
    }
}

iniciarSistemaLibras();

