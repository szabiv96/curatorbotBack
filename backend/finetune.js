const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
    apiKey: "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"
})

const openai = new OpenAIApi(config);

const runPrompt = async () => {
    const prompt = "What are some of the themes explored in his artworks? /N";

    /* const response = await openai.createFineTune({
        training_file: 'file-G4LhcAsCQ14gnSpKynSl09p8',
        model: "curie",
        n_epochs: 10,
        learning_rate_multiplier: 0.1,
    }) */

    /* const response = await openai.createCompletion({
        model: "curie:ft-personal-2023-02-15-13-17-56",
        prompt: "What is Varga Szabolcs Lajos's degree thesis?",
        temperature: 0,
        max_tokens: 45,
    }) */

    /* const response = await openai.listFineTunes(); */

    /* const response2 = await openai.deleteFile("file-G4LhcAsCQ14gnSpKynSl09p8"); */

    /* const response2 = await openai.listFiles(); */

    /* console.log(response.data.data); */

    console.log(response.data);
    /* console.log(response2.data.data); */



}

runPrompt();

/* curie:ft-personal-2023-02-15-13-17-56 */


/* file-sZj0PSzAEqus1dJmemQSVbX8 */