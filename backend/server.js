//packages
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
require('dotenv').config()

//middleware
app.use(express.json());
app.use(cors());

//openai config
const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(config);

//endpoint for the audio file
app.use('/audio', express.static('audio', { extensions: ['mp3', 'ogg', 'wav'] }));

//endpoint for the ai answer and generating tha audiofile from it
app.post('/curatorbot', (req, res) => {
    console.log(req.body.key1);
    //openai
    const runPrompt = async () => {
        const prompt = req.body.key1;

        console.log(req.body.key1);

        // async request from the fine-tuned ai, prompt is data from the front
        const response = await openai.createCompletion({
            model: "curie:ft-personal-2023-02-15-13-17-56",
            prompt: prompt,
            temperature: 0,
            max_tokens: 200,
            stop: "\n"
        })

        /* console.log(response.data.choices[0].text); */

        //Microsoft Azure Speech creating the audio file
        function my() {
            "use strict";

            // NEWFILENAME SHOULD BE LESS CHARACTER, LIKE THE ANSWEAR FIRST 10 CHARACTER OR SG !!!! 
            const input = (JSON.stringify(req.body.key1)).substring(1, 25);
            const newFileName = input.replace(/\s/g, '')

            console.log(newFileName);

            const audioFile = `audio/${newFileName}.mp3`;
            const voiceLanguage = "en-US-GuyNeural"
            //environment variables named "SPEECH_KEY" and "SPEECH_REGION" and config
            const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
            const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
            // The language of the voice that speaks.
            speechConfig.speechSynthesisVoiceName = voiceLanguage;
            // Create the speech synthesizer.
            var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

            function my2() {
                // generated answer converted to string format
                const text = JSON.stringify(response.data.choices[0].text);

                // the magic with error handling 
                synthesizer.speakTextAsync(text,
                    function (result) {
                        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                            console.log("synthesis finished.");
                            res.status(200).send(JSON.stringify(response.data.choices[0].text))
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
                console.log("Now synthesizing!");
            };
            my2()
        };
        my()
    }
    runPrompt();
})

app.get('/files', (req, res) => {
    const directoryPath = 'audio';

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Error reading directory');
            return;
        } else {

            const audioFiles = files.filter(file => /\.(mp3|wav|ogg)$/i.test(file));
            const audioUrls = audioFiles.map(file => `/audio/${file}`);

            res.json(audioUrls);
        }
    });
});

// port
app.listen(3000, () => console.log('Server started and listening on http://127.0.0.1:3000'))