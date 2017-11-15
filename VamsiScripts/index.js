var startBtn, stopBtn, hypothesisDiv, statusDiv, key, languageOptions, formatOptions;
var SDK;
var recognizer;
var previousSubscriptionKey;
var input;
var voices = speechSynthesis.getVoices();
var isPlatinum = false;
var mobileNo;
var dashboardName = "";
var response;

// On doument load resolve the SDK dependecy
        function Initialize(onComplete) {
			console.log("1");
            require(["Speech.Browser.Sdk"], function(SDK) {
                onComplete(SDK);
				$("#mobileNo").prop("disabled", true);
				voiceoutput("Welcome. Provide the dashboard name that you want to view.");
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
						openDashboard($('#hypothesisDiv').text());
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
	
function openDashboard(data){	
	dashboardName = data;
	console.log("Dashboard name is " + dashboardName);
	if(dashboardName != "" && dashboardName != null){
		voiceoutput("Please wait, while we load your dashboard")
	}
	else{
		voiceoutput("Provide the dashboard name that you want to view.")
		/*if (!recognizer || previousSubscriptionKey != key.value) {
			previousSubscriptionKey = key.value;
            Setup();
        }*/                
		RecognizerStart(SDK, recognizer);
	}
}

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
