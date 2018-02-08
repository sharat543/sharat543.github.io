// On doument load resolve the SDK dependecy
        function Initialize(onComplete) {
            require(["Speech.Browser.Sdk"], function(SDK) {
                onComplete(SDK);
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
                        UpdateStatus("Listening");
                        break;
                    case "RecognitionStartedEvent" :
                        UpdateStatus("Listening_Recognizing");
                        break;
                    case "SpeechStartDetectedEvent" :
                        UpdateStatus("Listening_DetectedSpeech_Recognizing");
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechHypothesisEvent" :
                        UpdateRecognizedHypothesis(event.Result.Text);
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechEndDetectedEvent" :
                        OnSpeechEndDetected();
                        UpdateStatus("Processing_Adding_Final_Touches");
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
                        UpdateStatus("Idle");
                        console.log(JSON.stringify(event)); // Debug information
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
		var startBtn, stopBtn, hypothesisDiv, phraseDiv, statusDiv, key;
		//var languageOptions, formatOptions;
        var SDK;
        var recognizer;
        var previousSubscriptionKey;
        var input;
        var voices = speechSynthesis.getVoices();
        document.addEventListener("DOMContentLoaded", function () {
            //createBtn = document.getElementById("createBtn");
            startBtn = document.getElementById("startBtn");
            stopBtn = document.getElementById("stopBtn");
            phraseDiv = document.getElementById("phraseDiv");
            hypothesisDiv = document.getElementById("hypothesisDiv");
            statusDiv = document.getElementById("statusDiv");
            key = document.getElementById("key");
         

            startBtn.addEventListener("click", function () {
                if (!recognizer || previousSubscriptionKey != key.value) {
                    previousSubscriptionKey = key.value;
                    Setup();
                }

                hypothesisDiv.innerHTML = "";
                phraseDiv.innerHTML = "";
                RecognizerStart(SDK, recognizer);
                startBtn.disabled = true;
                stopBtn.disabled = false;
            });
			
			speakAgainsmall.addEventListener("click", function () {
                if (!recognizer || previousSubscriptionKey != key.value) {
                    previousSubscriptionKey = key.value;
                    Setup();
                }

                hypothesisDiv.innerHTML = "";
                phraseDiv.innerHTML = "";
                RecognizerStart(SDK, recognizer);
                startBtn.disabled = true;
                stopBtn.disabled = false;
            });
			
			speakAgainbig.addEventListener("click", function () {
                if (!recognizer || previousSubscriptionKey != key.value) {
                    previousSubscriptionKey = key.value;
                    Setup();
                }

                hypothesisDiv.innerHTML = "";
                phraseDiv.innerHTML = "";
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
                voiceoutput("Hello! I'm your voice assistant,how can i help you ?",1)
            });
        });
		
        function voiceoutput(text,flag){

            if('speechSynthesis' in window){
			var speech = new SpeechSynthesisUtterance(text);
			speech.lang = 'en-GB';
			speech.voice = voices[1];
			window.speechSynthesis.speak(speech);
			if (flag==1)
			{
            setTimeout(activatestart, 4000);
			}
			else if (flag == 2)
			{
			setTimeout(voiceoutput, 10000);
			}
           
			}
        } 
		
        // function voiceoutput_detection(text){

         //   if('speechSynthesis' in window){
		//	var speech = new SpeechSynthesisUtterance(text);
		//	speech.lang = 'en-US';
		//	speech.voice = voices[4]
		//	window.speechSynthesis.speak(speech);
         //   setTimeout(activatestart, 4000);
         //
        //    UpdateRecognizedHypothesisUserConfirmation(text);   
		//	}
        //} 
		
        function activatestart()
        {   
          
            $(startBtn).click() 
            $(startBtn).hide()
            $(stopBtn).hide()
			$(speakAgainsmall).hide()           
        }
		
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
		var db;
		var fld;
		var val;
		
		
        function UpdateRecognizedPhrase(json) {
            $.get("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/631f2b5e-8875-48f2-984c-9e7e7c78a3e2?subscription-key=c642986d701f44b29227bc3b60fab71b&verbose=true&timezoneOffset=0&q="+input+"",
			//$.get("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/21b9dd19-9b03-4fb5-87a8-337112c474b7?subscription-key=c642986d701f44b29227bc3b60fab71b&verbose=true&timezoneOffset=0&q="+input+"",
			//$.get("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5cac76d5-cdf5-4928-a48e-3fc400c5430a?subscription-key=c642986d701f44b29227bc3b60fab71b&timezoneOffset=0&verbose=true&q="+input+"",
                function(data){
                 phraseDiv.innerHTML =  JSON.stringify(data);
          if (data.entities.length === 0)
					{
						voiceoutput("Please provide a valid input",0); 
						if(viz) {$(speakAgainsmall).show();}
					}
				 else
					{		
						for (var t=0; t < data.entities.length; t++) 
						{	
							if ( data.entities[t].type === "Dashboard" && data.entities.length == 1)
							{ db = data.entities[t].entity; fld = 0; val = 0;}
							else if (data.entities[t].type === "Dashboard" ) 
							{ db = data.entities[t].entity; }
							else if (data.entities[t].type != "builtin.datetimeV2.daterange" &&  data.entities[t].type != "Dashboard" )
							{ fld = data.entities[t].type; val = data.entities[t].entity;} 
						}

						var var1 = dashboardcheck(db);
						
						if ( var1 === 0 ) 
						{ 
						voiceoutput("Please provide a valid dashboard name",0); 
						if(viz) {$(speakAgainsmall).show();}
						}

						else
						{
						var var2 = fieldcheck(db,fld);
						
							if ( var2 === 0 )
							{
							voiceoutput("Provided dimension does not belong to the dashboard");
							if(viz) {$(speakAgainsmall).show();}
							}
							else
							{
							
							initViz(db,fld,val,urlvalue);
							}
						}
					}
				 //}
                 //catch(err)
                 //{
                    
                // }
                 //JSON.stringify(data.entities[0].type )+ ":"+ JSON.stringify(data.entities[0].entity);
                });
		}
		function OnComplete() {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }