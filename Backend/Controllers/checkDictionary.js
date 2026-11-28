// Shayan Sheikh


export async function checkDictionary(req, res){
    const {word} =  req.params


    if (!word || word.trim() === "") {
    return res.status(400).json({
        error: "Please enter a word"
        });
    }


    try {
    const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`
    );

    if (!response.ok) {
        return res.status(response.status).json({
            error: "Unable to find definition"
        });
    }

    const data = await response.json();
    return res.status(200).json({
    word: data[0].word,
    definition: data[0].meanings[0].definitions[0].definition
        });

    
    

    } catch (error) {
    return res.status(500).json({
        error: "Unable to fetch definition"
    });
}


}
