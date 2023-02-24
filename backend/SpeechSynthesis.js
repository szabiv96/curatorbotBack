require('dotenv').config()

  function my() {

    "use strict";

    var sdk = require("microsoft-cognitiveservices-speech-sdk");

    var audioFile = "YourAudioFile.wav";
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    function my2() {
      // Start the synthesizer and wait for a result.
      const text = "hey this is it such a wonderful life!"
      
      synthesizer.speakTextAsync(text,
        function (result) {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log("synthesis finished.");
          } else {
            console.error("Speech synthesis canceled, " + result.errorDetails +
              "\nDid you set the speech resource key and region values?");
          }
          synthesizer.close();
          synthesizer = null;
        },
        function (err) {
          console.trace("err - " + err);
          synthesizer.close();
          synthesizer = null;
        });
      console.log("Now synthesizing to: " + audioFile);
    };
    my2()
  };
  my()