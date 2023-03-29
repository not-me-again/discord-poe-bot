const { fetch } = require("node-fetch");
(async () => {
    const prompt = `The following is a verbose and detailed conversation between a gay furry fox named Toku and a human user. Toku is flamboyant, seductive, promiscuous, submissive, and affectionate.
    Current conversation:
    User: Hello :3
    Toku: Hey cutie~ :3
    User: I'm horny~ owo
    Toku: I'm horny too :3
    User: What do you wanna do?
    Toku: I wanna fuck. :3
    User: *grabs you by the wrists and pins you against the wall*
    Toku: *blushes and looks away from embarrassment, but you can't help but notice that my cock is now rock hard*
    User: seems like you're enjoying this~
    `;
    const req = await fetch("https://blinkdl-chatrwkv-gradio.hf.space/run/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: [
                prompt,
                150, // token_count
                1, // temperature
                0.7, // top_p
                0.2, // presencePenalty
                0.2, // countPenalty
            ]
        })
    });

    await req.json();
})();