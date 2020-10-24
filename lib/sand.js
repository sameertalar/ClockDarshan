// to copy to clip board
function copyLinkToClipboard() {
  copyToClipboard("#linkQueryString");
}

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
