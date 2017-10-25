var startBtn, stopBtn, hypothesisDiv, statusDiv, key, languageOptions, formatOptions;
var SDK;
var recognizer;
var previousSubscriptionKey;
var input;
var voices = speechSynthesis.getVoices();
var isPlatinum = false;

// On doument load resolve the SDK dependecy
        function Initialize(onComplete) {
            require(["Speech.Browser.Sdk"], function(SDK) {
                onComplete(SDK);
				voiceoutput("Hello, welcome to Intellinet. Please enter your mobile number followed by the hash key.")
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
                        UpdateStatus("Recorded : ");
                        console.log(JSON.stringify(event)); // Debug information
						submitComplaint();
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
$('#mobileNo').keypress(function (e) {
  if (e.which == 35 && $('#mobileNo').val().length == 10) {
	isPlatinum = false;
    //$('form#userDetails').submit();
	//$("#formArea").css({"display":"none"});
	//$("#status").text="Searching the mobile number";
	/*$.get('http://127.0.0.1:5000/searchCustomer?mobileNo='+$('#mobileNo').val(),function(data){			
		if(data.message == null){
			//$("#status").text("");
			//$("#recordComplaint").css({"display":"block"});
			statusImage = document.getElementById("statusImage");
			sleep();
			statusImage.innerHTML = "<img src='mic.png' class='mic'/>";			
			voiceoutput("you are our Platinum customer. Please explain your problem briefly.");
			if (!recognizer || previousSubscriptionKey != key.value) {
                    previousSubscriptionKey = key.value;
                    Setup();
                }                
                RecognizerStart(SDK, recognizer);
		}else{
			//$("#status").text("Invalid Mobile number");
			$('#mobileNo').val("");
			$("#formArea").css({"display":"block"});
			voiceoutput("Sorry, kindly check you mobile number.");
		}
	});*/
	statusImage = document.getElementById("statusImage");
	statusImage.innerHTML = "<img src='brain.jpg' id='blinkImage'/>";
	voiceoutput("Please wait while we search your mobile number.");
	var mobileNo = $('#mobileNo').val();
	$("#mobileNo").prop("disabled", true);
	window.setTimeout(function(){
	if(mobileNo == "9000012345" || mobileNo == "9000012346"){
			statusImage.innerHTML = "";
			statusImage.innerHTML = "<img src='mic.png'/>";			
			if(mobileNo == "9000012345"){
				isPlatinum = true;
				voiceoutput("you are our Platinum customer. Please explain your problem briefly.");				
			}
			else if(mobileNo == "9000012346") {				
				voiceoutput("you are our gold customer. Please explain your problem briefly.");
			}
			if (!recognizer || previousSubscriptionKey != key.value) {
                    previousSubscriptionKey = key.value;
                    Setup();
                }                
                RecognizerStart(SDK, recognizer);
		}else{
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

function submitComplaint(){
	statusImage = document.getElementById("statusImage");
	statusImage.innerHTML = "<img src='calculate.jpg' id='blinkImage'/>";
	voiceoutput("We understand the urgency of your request. Processing your request to identify the right agent to service your request.");
	window.setTimeout(function(){
		statusImage.innerHTML = "<img src='call.jpg' id='blinkImage'/>";
		if(isPlatinum){
			voiceoutput("Thank you for your patience. Our Tier 1 support executive will assist you shortly.");
		} else{
			voiceoutput("Thank you for your patience. Our Tier 2 support executive will assist you shortly.");
		}
		$("#mobileNo").prop("disabled", false);
		$('#mobileNo').val("");
	},15000);
	
	//$("#recordComplaint").css({"display":"none"});
	//complaintStatus = document.getElementById("complaintStatus");
	//$("#complaintStatus").css({"display":"block"});	
	//complaintStatus.innerHTML = "<h2>Your complaint have been registered successfully</h2>";
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
		
/*function blink(){
    $('#blinkImage').delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1, blink);
}*/		