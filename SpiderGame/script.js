kaplay();

setGravity(1000);

loadSprite("spider", "https://i.imgur.com/Ard6x3d.png");
loadSprite("ostacolo", "https://i.imgur.com/lHe40jL.png");
loadSprite("background", "https://i.imgur.com/eGVvHUR.png");

scene("game", () => {
    add([
        sprite("background"), 
        pos(0, 0),             
        fixed()              
    ]);

    const spider = add([
        sprite("spider"),
        pos(80, 100),
        area({ width: 6, height: 10, offset: vec2(-13, -1) }),
        body(),
        scale(0.15),
    ]);

    let score = 0;
    const scoreText = add([
        text(score.toString()),
        pos(24, 24),
        fixed(),
        { value: score }
    ]);

    onKeyPress("space", () => {
        spider.jump(400);
    });

    onKeyDown("a", () => {
        spider.move(-200, 0);
    });

    onKeyDown("d", () => {
        spider.move(200, 0);
    });

    function spawnostacolo() {
        const y = rand(20, 650);
        add([
            sprite("ostacolo"),
            scale(0.4),
            pos(width(), y),
            area(),
            move(LEFT, 250),
            "ostacolo",
            { passed: false }
        ]);
        wait(0.65, spawnostacolo);
    }
    spawnostacolo();

    onUpdate("ostacolo", (o) => {
        if (o.pos.x + o.width < spider.pos.x && !o.passed) {
            o.passed = true;
            score += 1;
            scoreText.text = score.toString();
        }
    });

    onUpdate(() => {
        if (spider.pos.y < 0 || spider.pos.y > height() || spider.pos.x < 0 || spider.pos.x > width()) {
            go("gameover", score);
        }
    });

    spider.onCollide("ostacolo", () => {
        wait(0.1, () => go("gameover", score));
    });
});

scene("gameover", (score) => {
    add([text("Game Over", { size: 48 }), pos(center().x, center().y - 60)]);
    add([text("Punteggio: " + score, { size: 32 }), pos(center().x, center().y)]);
    add([text("Premi R per riavviare", { size: 24 }), pos(center().x, center().y + 60)]);
    
    onKeyPress("r", () => {
        go("game");
    });
});

go("game");