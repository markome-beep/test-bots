<script lang="ts">
	import { Bot } from 'basic-bot-script';
	import BotBox from './BotBox.svelte';
	import { GameLoop } from './gameloop';
	let src = $state('');
	let x = $state(0);
	let y = $state(0);
	let dir = $state();
	let time = $state(0);

	let bot: undefined | Bot = $state();

	const newBot = () => {
		if (bot) {
			bot.free();
			bot = undefined;
		}
		bot = Bot.new(src);
	};

	const render = (frac: number) => {
		time += 5;
		let pos = bot?.get_state(frac);
		if (pos) {
			x = pos.x;
			y = pos.y;
			dir = pos.dir;
			pos.free();
			pos = undefined;
		}
	};

	let flash = $state(false);

	const test = () => {
		flash = true;
		setTimeout(() => {
			flash = false;
		}, 50);
	};

	const tick = () => {
		test();
		bot?.tick();
	};

	let loop = new GameLoop(tick, render);
</script>

<button
	class="m-2 rounded bg-white p-1 shadow-lg"
	onclick={() => {
		loop.start();
	}}>start</button
>

<button
	class="m-2 rounded bg-white p-1 shadow-lg"
	onclick={() => {
		loop.stop();
	}}>stop</button
>

<button class="m-2 rounded bg-white p-1 shadow-lg" onclick={newBot}>Make Bot</button>
<div class="m-2 flex flex-row">
	<textarea name="code" bind:value={src}></textarea>
	{#if flash}
		<div class="h-5 w-5 bg-red-950"></div>
	{/if}
</div>

<BotBox --x={x + 'px'} --y={y + 'px'} --dir={dir + 'rad'} />
