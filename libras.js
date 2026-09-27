let iniciouAbrir = false;
let tempoInicio = 0;

function maoCurvada(pontos) {
    return (
        pontos[8].y > pontos[6].y &&
        pontos[12].y > pontos[10].y &&
        pontos[16].y > pontos[14].y &&
        pontos[20].y > pontos[18].y
    );
}

function maoFormatoL(pontos) {
    const indicadorAberto =
        pontos[8].y < pontos[6].y;

    const medioFechado =
        pontos[12].y > pontos[10].y;

    const anelarFechado =
        pontos[16].y > pontos[14].y;

    const mindinhoFechado =
        pontos[20].y > pontos[18].y;

    const polegarAberto =
        Math.abs(pontos[4].x - pontos[2].x) > 0.05;

    return (
        indicadorAberto &&
        medioFechado &&
        anelarFechado &&
        mindinhoFechado &&
        polegarAberto
    );
}

export function reconhecerAbrir(maos) {
    if (maos.length < 2) {
        iniciouAbrir = false;
        return false;
    }

    const mao1 = maos[0];
    const mao2 = maos[1];

    if (maoCurvada(mao1) && maoCurvada(mao2)) {
        iniciouAbrir = true;
        tempoInicio = Date.now();
    }

    const terminou =
        iniciouAbrir &&
        Date.now() - tempoInicio < 3000 &&
        maoFormatoL(mao1) &&
        maoFormatoL(mao2);

    if (terminou) {
        iniciouAbrir = false;
        return true;
    }

    return false;
}

let inicioYoutube = 0;

function maoFormatoY(pontos) {
    const indicadorFechado =
        pontos[8].y > pontos[6].y - 0.025;

    const medioFechado =
        pontos[12].y > pontos[10].y - 0.025;

    const anelarFechado =
        pontos[16].y > pontos[14].y - 0.025;

    const dedosFechados = [
        indicadorFechado,
        medioFechado,
        anelarFechado
    ].filter(Boolean).length;

    const mindinhoAberto =
        pontos[20].y < pontos[18].y + 0.02;

    const polegarAberto =
        Math.abs(pontos[4].x - pontos[2].x) > 0.035;

    return (
        dedosFechados >= 2 &&
        mindinhoAberto &&
        polegarAberto
    );
}
function distancia(ponto1, ponto2) {
    const x = ponto1.x - ponto2.x;
    const y = ponto1.y - ponto2.y;

    return Math.sqrt(x * x + y * y);
}

function maoComIndicador(pontos) {
    const tamanhoPalma =
        distancia(pontos[5], pontos[17]);

    const indicadorReto =
        distancia(pontos[8], pontos[5]) >
        tamanhoPalma * 1.2;

    const medioFechado =
        distancia(pontos[12], pontos[9]) <
        tamanhoPalma * 1.2;

    const anelarFechado =
        distancia(pontos[16], pontos[13]) <
        tamanhoPalma * 1.2;

    const mindinhoFechado =
        distancia(pontos[20], pontos[17]) <
        tamanhoPalma * 1.2;

    return (
        indicadorReto &&
        medioFechado &&
        anelarFechado &&
        mindinhoFechado
    );
}
export function reconhecerYoutube(maos) {
    if (maos.length === 0) {
        inicioYoutube = 0;
        return false;
    }

    const encontrouY =
        maos.some(function(mao) {
            return maoFormatoY(mao);
        });

    if (!encontrouY) {
        inicioYoutube = 0;
        return false;
    }

    if (inicioYoutube === 0) {
        inicioYoutube = Date.now();
    }

    if (Date.now() - inicioYoutube >= 600) {
        inicioYoutube = 0;
        return true;
    }

    return false;
}