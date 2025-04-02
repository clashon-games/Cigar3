export default class UserInterface {
    constructor(core) {
        this.core = core


        this.keysPressed = {};
        this.ejectInterval = null;

        this.scoreElement = document.getElementById('score');
        this.pingElement = document.getElementById('ping');
        this.leaderboard = document.getElementById('leaderboard');
        this.minionControlled = document.getElementById('minion-controlled');

        setInterval(() => {
            this.scoreElement.innerHTML = `Score: ${this.core.app.camera.score}`;
            this.minionControlled.style.display = this.core.net.minionControlled ? 'block' : 'none';
            this.pingElement.innerHTML = `Ping: ${this.core.net.ping}`;
        }, 40);

        this.addEvents();
    }

    addEvents() {
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        addEventListener('keydown', this.onKeyDown);
        addEventListener('keyup', this.onKeyUp);
        addEventListener('resize', this.onResize);
        addEventListener('beforeunload', (event) => {
            this.core.store.settings = this.core.settings.rawSettings;
            event.cancelBubble = true;
            event.returnValue = 'You sure you want to leave?';
            event.preventDefault();
        });

        this.core.app.view.addEventListener('wheel', this.onScroll, {
            passive: true,
        });
    }

    updateLeaderboard() {
        let contentStr = ""
        const leaderboard = this.core.net.leaderboardItems
        for (const player of leaderboard) {
            contentStr += `<div class="hud-leaderboard-tile ${player.isMe ? "red-text" : ""}">${player.name}</div>`
        }
        this.leaderboard.innerHTML = ""
        this.leaderboard.insertAdjacentHTML('beforeend', contentStr)
    }



    onScroll({
        deltaY
    }) {
        this.core.app.camera.w += deltaY * -.001 //event.deltaY * -1 / 1000;
        this.core.app.camera.w = Math.min(Math.max(.05, this.core.app.camera.w), 8)
    }
    onKeyDown({
        code
    }) {
        this.keysPressed[code] = true;

        switch (code) {
            case 'KeyW':
                if (!this.ejectInterval) {
                    this.core.net.sendEject();
                    this.ejectInterval = setInterval(() => {
                        if (this.keysPressed['KeyW']) this.core.net.sendEject();
                        else clearInterval(this.ejectInterval);
                    }, 50);
                }
                break;
            case "Space":
                this.core.net.sendSplit();
                break;
            case "KeyQ":
                this.core.net.sendMinionSwitch();
                break;

            case "KeyE":
                this.core.net.sendE();
                break;
            case "KeyR":
                this.core.net.sendR();
                break;
            case "KeyT":
                this.core.net.sendT();
                break;
            case "KeyP":
                this.core.net.sendP();
                break;
        }
    }

    onKeyUp({
        code
    }) {
        this.keysPressed[code] = false;

        if (code === "KeyW" && this.ejectInterval) {
            clearInterval(this.ejectInterval);
            this.ejectInterval = null;
        }
    }

    onResize() {
    }


}
