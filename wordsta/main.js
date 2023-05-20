window.onload = () => {
    let data = top_1000_data["words"];
    

    console.log(top_1000_data);
    console.log(top_1000_data.length);

    /*
    <div id="score">0</div>
    <div id="vocab">coast</div>
    <div id="meaning_options">
        <div class="meaning_option" id="option0">compose or represent</div>
        <div class="meaning_option" id="option1">show an image of</div>
        <div class="meaning_option" id="option2">the shore of a sea or ocean</div>
        <div class="meaning_option" id="option3">deem to be</div>
    </div>
    */

    let vocab_box = document.getElementById("vocab");
    let score_box = document.getElementById("score");
    let wrong_box = document.getElementById("wrong");
    
    let score = 0, answer = 2;
    let wrong_list = Array();

    let option_box = Array(4);
    for (let i=0; i<4; i++) {
        console.log("option" + i);
        option_box[i] = document.getElementById("option" + i);
        option_box[i].onclick=(e)=>{handleClick(e, i)};
    }

    function getRandom(min, max) {
        // get a random number in the interval: [min, max)
        return Math.floor(Math.random()*(max-min))+min;
    }

    function handleClick(e, clicked_number) {
        console.log(clicked_number);
        // e.target.innerText="clicked";

        // update score
        if (clicked_number == answer) {
            score++;
        }
        else {
            score--;
            let original_color = e.target.style.background;
            // e.target.style.background = "red";
            wrong_list.push(vocab_box.innerText);
            let comp = document.createElement('div', className='wrong');
            comp.appendChild(
                document.createTextNode(vocab_box.innerText + ": " + option_box[answer].innerText)
            );
            wrong_box.appendChild(
                comp
            );
        }
        score_box.innerText = score;

        // update options
        let rand = Array(4);
        for (let i = 0; i < 4; i++) {
            var same = true;
            while (same == true) {
                same = false;
                rand[i] = getRandom(0, data.length);
                for (let j = 0; j < i; j++) {
                    if (rand[i] == rand[j]) same = true;
                }

                // filter out too difficult words
                if (data[rand[i]]["difficulty"] > 200) same = true;
            }
            option_box[i].innerText = data[rand[i]]["definition"];
        }
        
        answer = getRandom(0, 4);
        vocab_box.innerText = data[rand[answer]]["word"]

    }








}


