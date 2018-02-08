var startBtn, stopBtn, hypothesisDiv, statusDiv, key, languageOptions, formatOptions;
var SDK;
var recognizer;
var previousSubscriptionKey;
var input;
var voices = speechSynthesis.getVoices();
var isPlatinum = false;
var mobileNo;
var complaint;
var response;

// On doument load resolve the SDK dependecy
        function Initialize(onComplete) {
			console.log("1");
            require(["Speech.Browser.Sdk"], function(SDK) {
                onComplete(SDK);
				$("#mobileNo").prop("disabled", true);
				voiceoutput("Tell me, how can I assist you?")
				statusImage.innerHTML = "";
				statusImage.innerHTML = "<img src='mic.png'/>";	
				if (!recognizer || previousSubscriptionKey != key.value) {
                    previousSubscriptionKey = key.value;
                    Setup();
                }                
				RecognizerStart(SDK, recognizer);
            });
        }
        
        // Setup the recongizer
        function RecognizerSetup(SDK, recognitionMode, subscriptionKey) {
            var recognizerConfig = new SDK.RecognizerConfig(
                new SDK.SpeechConfig(
                    new SDK.Context(
                        new SDK.OS(navigator.userAgent, "Browser", null),
                        new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
                recognitionMode
                ); 

           
            var authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

            return SDK.CreateRecognizer(recognizerConfig, authentication);
        }

        // Start the recognition
        function RecognizerStart(SDK, recognizer) {
            recognizer.Recognize((event) => {
                /*
                 Alternative syntax for typescript devs.
                 if (event instanceof SDK.RecognitionTriggeredEvent)
                */
                switch (event.Name) {
                    case "RecognitionTriggeredEvent" :
                        UpdateStatus("Initializing");
                        break;
                    case "ListeningStartedEvent" :
                        //UpdateStatus("Listening : ");
						UpdateStatus("");
                        break;
                    case "RecognitionStartedEvent" :
                        //UpdateStatus("Listening_Recognizing : ");
                        break;
                    case "SpeechStartDetectedEvent" :
                        //UpdateStatus("Listening_DetectedSpeech_Recognizing : ");
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechHypothesisEvent" :
                        UpdateRecognizedHypothesis(event.Result.Text);
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechEndDetectedEvent" :
                        OnSpeechEndDetected();
                        //UpdateStatus("Processing_Adding_Final_Touches : ");
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechSimplePhraseEvent" :
                        UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                        break;
                    case "SpeechDetailedPhraseEvent" :
                        UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                        break;
                    case "RecognitionEndedEvent" :
                        OnComplete();
                        console.log(JSON.stringify(event)); // Debug information
						submitComplaint($('#hypothesisDiv').text());
						//alert($('#hypothesisDiv').text());
                        break;
                }
            })
            .On(() => {
                // The request succeeded. Nothing to do here.
            },
            (error) => {
                console.error(error);
            });
        }

        // Stop the Recognition.
        function RecognizerStop(SDK, recognizer) {
            // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
            recognizer.AudioSource.TurnOff();
        }
				
        document.addEventListener("DOMContentLoaded", function () {
            createBtn = document.getElementById("createBtn");
            startBtn = document.getElementById("startBtn");
            stopBtn = document.getElementById("stopBtn");
           // phraseDiv = document.getElementById("phraseDiv");
            hypothesisDiv = document.getElementById("hypothesisDiv");
            statusDiv = document.getElementById("statusDiv");
            key = document.getElementById("key");
         

            startBtn.addEventListener("click", function () {
                if (!recognizer || previousSubscriptionKey != key.value) {
                    previousSubscriptionKey = key.value;
                    Setup();
                }

                hypothesisDiv.innerHTML = "";
               // phraseDiv.innerHTML = "";
                RecognizerStart(SDK, recognizer);
                startBtn.disabled = true;
                stopBtn.disabled = false;
            });

            stopBtn.addEventListener("click", function () {
                RecognizerStop(SDK);
                startBtn.disabled = false;
                stopBtn.disabled = true;
            });

            Initialize(function (speechSdk) {
                SDK = speechSdk;
                startBtn.disabled = false;
            });
        });

        function Setup() {
            recognizer = RecognizerSetup(SDK, SDK.RecognitionMode.Interactive, key.value);
        }

        function UpdateStatus(status) {
            statusDiv.innerHTML = status;
        }

        function UpdateRecognizedHypothesis(text) {
            hypothesisDiv.innerHTML = text;
            input = text;
        }

        function OnSpeechEndDetected() {
            stopBtn.disabled = true;
        }

        function OnComplete() {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
	


// Numeric only control handler
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 || 
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

$('#mobileNo').keypress(function (e) {
  if (e.which == 35 && $('#mobileNo').val().length == 10) {	
	isPlatinum = false;
	statusImage = document.getElementById("statusImage");
	statusImage.innerHTML = "<img src='brain.jpg' id='blinkImage'/>";
	voiceoutput("Please wait, while we search your mobile number.");
	$("#mobileNo").prop("disabled", true);
	window.setTimeout(function(){
	mobileNo = $('#mobileNo').val();
	$("#mobileNo").prop("disabled", true);
	if(mobileNo == "9000012345" || mobileNo == "9000012346" || mobileNo == "9000012347"){
			if(mobileNo == "9000012345"){
				isPlatinum = true;				
				voiceoutput("Welcome John, to intelligent ticket routing system. Please wait while your request is being processed.");	
				calculateComplaintPriority();
				console.log(response);
				recordComplaint(response.priority);
			}
			else if(mobileNo == "9000012346") {					
				voiceoutput("Welcome Alex, to intelligent ticket routing system. Please wait while your request is being processed.");
				calculateComplaintPriority();
				console.log( response);
				recordComplaint( response.priority);	
			}
			else if(mobileNo == "9000012347") {	
				voiceoutput("Welcome Mark, to intelligent ticket routing system. Please wait while your request is being processed.");
				calculateComplaintPriority();
				console.log( response);
				recordComplaint( response.priority);	
			}
			
		}else{
			statusImage.innerHTML = "";
			$('#mobileNo').val("");
			$("#formArea").css({"display":"block"});
			$("#mobileNo").prop("disabled", false);
			voiceoutput("Sorry, kindly check you mobile number.");
		}
	
	//$("#formArea").css({"display:none"});
    return false;    //<---- Add this line
	}, 5000 );
  }
});

function submitComplaint(data){
	complaint = data;
	if(data != ""){
		voiceoutput('Please enter your mobile number followed by the hash key for confirming your details');	
		$("#mobileNo").prop("disabled", false);
		statusImage = document.getElementById("statusImage");	
		statusImage.innerHTML = "";
	}
	else{
		voiceoutput("Tell me, how can I assist you?")
		statusImage.innerHTML = "";
		statusImage.innerHTML = "<img src='mic.png'/>";	
		/*if (!recognizer || previousSubscriptionKey != key.value) {
			previousSubscriptionKey = key.value;
            Setup();
        }*/                
		RecognizerStart(SDK, recognizer);
	}
}

function recordComplaint(tier){
	statusImage = document.getElementById("statusImage");
	statusImage.innerHTML = "<img src='calculate.jpg' id='blinkImage'/>";
	
	window.setTimeout(function(){
	if ( tier == 1)
	{
	voiceoutput("Your case has been assigned to our tier 1 support executive. You will be assisted shortly. Here's your case number");
	}
	else if (tier == 2)
	{
	voiceoutput("A case has been created and You will be contacted shortly. Here's your case number");
	}
	else{
	voiceoutput("Your case has been assigned to our tier 2 support executive. You will be assisted shortly. Here's your case number");
	}
	statusImage.innerHTML = "<img src='call.jpg' id='blinkImage'/>";
	}, 9000 );
}



$("#mobileNo").ForceNumericOnly();

function voiceoutput(text){

            if('speechSynthesis' in window){
			var speech = new SpeechSynthesisUtterance(text);
			speech.lang = 'en-US';
			speech.voice = voices[4]
			window.speechSynthesis.speak(speech);			
           
			}
        } 
		
		
function calculateComplaintPriority(){	
	var data = {mobileNo:mobileNo,complaint:complaint}
	$.ajax({
    url: 'http://127.0.0.1:5000/registerComplaint',
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: false,
    success: function(msg) {
		response = msg;
    }
});
}	
		
/*function blink(){
    $('#blinkImage').delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1, blink);
}*/		
