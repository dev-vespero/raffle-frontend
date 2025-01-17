export function readfiles (files) {
  var existinginputs = document.getElementsByName('images[]');
  while (existinginputs.length > 0) {
    form.removeChild(existinginputs[0]);
  }

  for (var i = 0; i < files.length; i++) {
    processfile(files[i]);
  }
  fileinput.value = "";
}

function processfile (file) {
  if (!(/image/i).test(file.type)) {
    alert("File " + file.name + " is not an image.");
    return false;
  }
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = function (event) {
    var blob = new Blob([event.target.result]);
    var myURL = window.URL || window.webkitURL;
    let blobURL = myURL.createObjectURL(blob);

    let image = new Image();
    image.src = blobURL;

    image.onload = function () {
      let resized = resizeMeToBlob(image);
      const contentType = 'image/jpg';
      const b64Data = resized.split(",")[1];
      imageBlob = base64toBlob(b64Data, contentType);
      nameFileDate = new Date().getTime() + ".jpg";
      containimagenVoucher.innerHTML = '<img src="' + resized + '">';
      resizeSmallUploadContainer()
      imagePushed = true
    }
  };
}

function resizeMeToBlob (img) {
  var canvas = document.createElement('canvas');
  var width = img.width;
  var height = img.height;
  if (width > height) {
    if (width > max_width) {
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

const base64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

function resizeSmallUploadContainer () {
  $('#container_voucher_up').removeClass("col-lg-12");
  $('#container_voucher_up').addClass("col-lg-6");
}
