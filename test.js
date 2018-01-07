const fs = require('fs');
const { convert } = require('convert-svg-to-png');
const cheerio = require('cheerio')
const Database = require('warehouse');
const readingTime = require('reading-time');
const moment = require('moment')

const db = new Database({path: './db.json'})
fs.readFile(__dirname+'/themes/nec.is/source/method-draw-image.svg', async function (err, data) {

    if (err) throw err;
    const svg = cheerio.load(data.toString())

    // ITERATE OVER POSTS


    db.load().then(async () => {
        var Post = db.model('Post');
        Post.each(async (post) => {
    
            const postDir = `${__dirname}/source/${post.source.replace('.md', '')}`;

            try {
                fs.accessSync(postDir, fs.constants.R_OK | fs.constants.W_OK);
            } catch (e) {
                // create post dir
                fs.mkdirSync(postDir);
            }


            svg('#TitleText').text(post.title)
            svg('#MetaText').text(`${moment(post.date).format('YYYY MMM D')} ・ ${readingTime(post.content).text.trim()}`)

            //console.log()
            const png = await convert(svg.html());

            fs.writeFileSync(`${postDir}/social-card.png`, png);
        })
    })


    // END ITREATION
})





