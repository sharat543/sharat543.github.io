(function (window) {
  var app = window.document.getElementById('app');

    app.apiKey = 'AIzaSyBr_ErupP3qUsA4I8OFTI9vDiXJYTA_AmI';

  app.maxResults = 1;
  app.features = [{
    type: 'FACE_DETECTION',
    name: 'Face detection',
    active: true
  }, {
    type: 'LANDMARK_DETECTION',
    name: 'Landmark detection',
    active: false
  }, {
    type: 'LOGO_DETECTION',
    name: 'Logo detection',
    active: false
  }, {
    type: 'LABEL_DETECTION',
    name: 'Label detection',
    active: false
  }, {
    type: 'TEXT_DETECTION',
    name: 'OCR',
    active: false
  }, {
    type: 'SAFE_SEARCH_DETECTION',
    name: 'Safe Search',
    active: false
  }, {
    type: 'IMAGE_PROPERTIES',
    name: 'Image properties',
    active: false
  }];

     if ('speechSynthesis' in window) {

          var msg = new SpeechSynthesisUtterance();
          var voices = window.speechSynthesis.getVoices();
          msg.voice = voices[3];
          msg.rate = 6/ 10;
          msg.pitch = 3;

      }

  app._analysePhoto = function (data) {
    if (!data) { return; }
    var request = app.$.request;
    var features = [];

//    app.$.chosenPhoto.src = data;

    data = data.split(',')[1];

//    app.features.forEach(function (f) {
//      if (f.active) {
//        features.push({
//          type: f.type,
//          maxResults: app.maxResults
//        });
//      }
//    });

    request.body = {
      requests: [
        {
          image: {
            content: data
          },
          features: [{type: "TEXT_DETECTION", maxResults: 5}]
        }
      ]
    };

//    app.$.results.innerHTML = 'Requesting data, please wait...';
    request.go();
  };

  app.takePhoto = function () {
    var video = app.$.video;

    video.pause();

    var data = video.capture();

    app._analysePhoto(data);
  };

app.openCam = function(){
    app.$.cam.style.display ='block';
    app.$.camBtn.style.display = 'none';
    app.$.header.style.display = 'none';
}

app.closeCam  = function(){
    app.$.cam.style.display ='none';
    app.$.camBtn.style.display = 'block';
    app.$.header.style.display = 'block';
}


  app.choosePhoto = function () {
    window.document.getElementById('upload').click();
  };

  window.document.getElementById('upload').addEventListener('change', function (e) {
    if (e.target.files && e.target.files.length > 0) {
      var file = e.target.files[0];
      var reader = new window.FileReader();
      reader.onload = function (re) {
        app._analysePhoto(re.target.result);
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  }, false);

  app.apiResponse = function (r) {
    var details = r.detail;

//    app.$.results.innerHTML = JSON.stringify(details, null, 2);


      if(details.responses && details.responses[0].fullTextAnnotation){

           filterProduct(details.responses[0].fullTextAnnotation.text);



      }else{
          console.log("take photo with product");
          app.$.labelInfo.innerHTML = "take photo with product" ;
          speak('take photo with product');
      }

    app.$.video.play();
  };

  app.apiError = function(e) {
    app.$.results.innerHTML = e.detail.message;
      console.log(e.detail.message);
    app.$.video.play();
  };

  function speak(msgTxt){

      if ('speechSynthesis' in window) {


          msg.text = msgTxt;

          msg.onend = function(e) {
            console.log('Finished in ' + event.elapsedTime + ' seconds.');
          };

          console.log(speechSynthesis);

          speechSynthesis.speak(msg);
      }
  }
  

  function filterProduct(productId){

     productId = productId.toLowerCase();

      if(productId.search("scotc")>-1 && productId.search("glue")>-1){
             app.$.labelInfo.innerHTML = "Jeans";
         }else if(productId.search("highlan")>-1 && productId.search("self")>-1){
             app.$.labelInfo.innerHTML = "Highland Self-Stick Removable Notes !";
         }else if(productId.search("camli")>-1 && productId.search("pencil")>-1){
             app.$.labelInfo.innerHTML = "Camlin Black Pencils !";
         }else if(productId.search("camli")>-1 && (productId.search("board")>-1 || productId.search("marker")>-1)){
             app.$.labelInfo.innerHTML = "Camlin White Board Marker !";
         }else{
              app.$.labelInfo.innerHTML = productId + ' We dont have this product in list ';
         }

      speak(app.$.labelInfo.innerHTML);
	  content.style.display = "block"; 
	  initViz(app.$.labelInfo.innerHTML);
  }
  
//added by Sarat
  var viz,url,sheet,workbook,sharray;
  if (viz) { // If a viz object exists, delete it.
             viz.dispose();
            }
  var counter=0;
  
  function initViz(v)
		{
			if (viz) { viz.dispose(); }
			viz=0;
            var containerDiv = document.getElementById("vizContainer"),
            options = {
                   	hideTabs: true,
					onFirstInteractive: function () {
									workbook = viz.getWorkbook();
									activeSheet = workbook.getActiveSheet();
									if (activeSheet.getSheetType() === 'dashboard')
									{
									sharray = activeSheet.getWorksheets();
									}
									else
									{
									sharray = null;
									}
									selectfilter(v);
									}	
               	      };
			 
			
			url = "https://public.tableau.com/shared/PSRTW34J2?:display_count=yes";

			viz = new tableau.Viz(containerDiv, url, options);
			document.getElementById('vizContainer').style.display='block';
			document.getElementById('fade').style.display='block';

        }
		

		function selectfilter(value) {
				
				if ( activeSheet.getSheetType() === 'dashboard' )
					{
					for (var j=0; j < sharray.length; j++) { sharray[j].applyFilterAsync("Product", value, tableau.FilterUpdateType.REPLACE); }
					}
					else
					{
					activeSheet.applyFilterAsync("Product", value, tableau.FilterUpdateType.REPLACE);
					}					
								
		}

  app.videoError = function (e) {
    app.$.videoError.innerHTML = 'Error accessing webcam: ' + (e.detail.message || e.detail.name || '');
  };

  app.captureError = function (e) {
    app.$.videoError.innerHTML = 'Error capturing webcam image: ' + (e.detail || '');
  };

}(this));
