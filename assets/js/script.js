document.addEventListener('dragstart', function (event) {
  if (event.target.classList.contains('drag-obj')) {
    event.target.classList.add('dragging');
  }
});

document.addEventListener('dragend', function (event) {
  const draggingElement = document.querySelector('.dragging');
  if (draggingElement) {
    draggingElement.classList.remove('dragging');
  }
});

document.addEventListener('dragover', function (event) {
  event.preventDefault();
});

document.addEventListener('drop', function (event) {
  event.preventDefault();
  const draggedElement = document.querySelector('.dragging');
  const dropTarget = event.target;

  if (dropTarget.classList.contains('espaco-obj')) {
    if (!dropTarget.innerHTML) {
      dropTarget.appendChild(draggedElement);
    } else {

      const existingElement = dropTarget.firstElementChild;
      dropTarget.appendChild(draggedElement);
      dropTarget.parentNode.appendChild(existingElement);
    }
  }
});


$(document).ready(function () {
  $(".drag-obj").on("dragstart", function (event) {
    $(this).addClass('dragging');
    event.originalEvent.dataTransfer.setData("text/plain", $(this).data('resp') + '-' + $(this).text());
  });

  $(".drag-obj").on("dragend", function (event) {
    $(this).removeClass('dragging');
  });

  $(".espaco-obj").on("dragover", function (event) {
    event.preventDefault();
  });

  var feedbacks = {
    '1': "Muito bem! A matriz swot facilita a adoção de estratégias para pôr em prática o que se planeja.",
    '2': "Parabéns, você acertou! As forças são as aptidões mais fortes de determinado contexto.",
    '3': "Resposta correta! A fraquezas podem indicar melhorias nas ações que se pretendem planejar.",
    '4': "Muito bem! O mercado imobiliário relaciona-se diretamente com questões políticas e econômicas do País.",
    '5': "Parabéns! Oportunidades são elementos externos que impactam positivamente do planejamento das ações." 
  };

  $(".espaco-obj").on("drop", function (event) {
    event.preventDefault();
    var partePaisData = event.originalEvent.dataTransfer.getData("text/plain").split('-');
    var partePais = partePaisData[0].trim();
    var espacoPais = $(this).data('resp').trim();
    var feedbackModalNegativo = $("#feedback-modal-negativo");

    if (partePais === espacoPais) {
        $(this).removeClass('bg-danger');
        $(this).addClass('bg-success');
        $("#audio-acerto")[0].play();
        fornecerFeedback(true, feedbacks[espacoPais]);
    } else {
        $(this).addClass('bg-danger');
        $(".drag-obj").removeClass('dragging');
        $("#audio-errado")[0].play();
        feedbackModalNegativo.modal("show");
    }
});

function fornecerFeedback(acertou, motivo) {
    if (acertou) {
        var feedbackModalPositivo = $("#feedback-modal-positivo");
        var feedbackTexto = feedbackModalPositivo.find(".modal-body");
        feedbackTexto.text("Parabéns! " + motivo);
        feedbackModalPositivo.modal("show");
    }
}


function escalaProporcao(largura, altura) {
  var larguraScreen = $(window).width();
  var alturaScreen = $(window).height();
  var proporcaoAltura = (alturaScreen * 100) / altura;
  var proporcaoLargura = (larguraScreen * 100) / largura;
  var proporcao, larguraAltura, larguraAlturaAuto;

  if (proporcaoAltura < proporcaoLargura) {
    larguraAltura = "height";
    larguraAlturaAuto = "width";
    proporcao = proporcaoAltura / 100;
  } else {
    larguraAltura = "width";
    larguraAlturaAuto = "height";
    proporcao = proporcaoLargura / 100;
  }

  console.log(proporcao, proporcaoAltura, proporcaoLargura)
  return [proporcao, larguraAltura, larguraAlturaAuto];
}

resizeBodyConteudo();

function resizeBodyConteudo() {
  var proporcao1920 = escalaProporcao(1920, 1080)[0];

  $(".conteudo").css({
    "transform": "scale(" + proporcao1920 + ")",
    "transform-origin": "center center"
  });

  var proporcao900;

  if ($(window).width() < 992) {
    proporcao900 = escalaProporcao(900, 576)[0];
  } else {
    proporcao900 = 1;
  }
}

$(window).resize(function () {
  resizeBodyConteudo()
})

});