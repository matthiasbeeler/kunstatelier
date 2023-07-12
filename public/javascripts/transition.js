$(".content").css("opacity", "1");
$(".topContent .topTitle").css("opacity", "1");
function redirect(destination) {
  window.scrollTo({top: 0, behavior: 'smooth'});
  $(".content").css("opacity", "0");
  $(".topContent .topTitle").css("opacity", "0");

  setTimeout(() => {
    window.location = destination;
  }, 100);
}

//date input
var el = document.getElementById("dateField");

el.onkeyup = function (evt) {
  if ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 &&
      evt.keyCode <= 105)) {
    evt = evt || window.event;

    var size = document.getElementById('dateField').value.length;
/*
    if ((size == 4 && document.getElementById('dateField').value > 31) || (size == 7 && Number(document
        .getElementById('dateField').value.split('-')[1]) > 99) || (size >= 10 && Number(document.getElementById(
        'dateField').value.split('-')[2]) > 2023)) {
      
      return;
    }
*/
    if ((size == 4 && document.getElementById('dateField').value < 2022) || (size == 7 && Number(document
        .getElementById('dateField').value.split('-')[1]) < 13)) {
      document.getElementById('dateField').value += '-';
    }
    if(size > 10){
      document.getElementById('dateField').value = document.getElementById('dateField').value.substring(0,10);
    }

  } else {
  }
}


function formRedirect(startForm, endForm) {
  window.scrollTo({top: 0, behavior: 'smooth'});
  $("."+startForm+"Form").css("opacity", "0");
  setTimeout(() => {
    $("."+startForm+"Form").css("display", "none");
    $("."+endForm+"Form").css("display", "block");
    $("."+endForm+"Form").css("opacity", "1");
  }, 100);
}