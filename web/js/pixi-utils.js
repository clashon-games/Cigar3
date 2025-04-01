import * as PIXI from 'pixi.js';

export function createPixiButton(caption, rad = 60) {
    const container = new PIXI.Container();

    const button = new PIXI.Graphics();
    button.beginFill(0xffffff);
    button.drawCircle(0, 0, rad);
    button.alpha = 0.2;
    button.tint = 0x404040;

    const text = new PIXI.Text(caption, {
        fontFamily: 'Russo One',
        fontSize: 20,
        fill: 0x000000,
    });
    text.anchor.set(0.5);
    text.x = 0;
    text.y = 0;

    // Add to container instead of button
    container.addChild(button);
    container.addChild(text);

    // Make the whole container interactive
    container.interactive = true;
    container.cursor = 'pointer';

    let last_click = 0;
    const delay = 100;

    container.on('pointerdown', () => {
        const now = performance.now();
        if (last_click + delay > now) return;
        last_click = now;

        if (button.tint < 0x800000) {
            button.tint = 0xffffff - button.tint;
        }
        container.emit('clicked');
    });

    const pointerup = () => {
        if (button.tint > 0x800000) {
            button.tint = 0xffffff - button.tint;
        }
    };

    container.on('pointerup', pointerup);
    container.on('pointerupoutside', pointerup);

    return container;
}
