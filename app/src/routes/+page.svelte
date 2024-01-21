<script>
	import { Radio } from 'flowbite-svelte';

	let selectElem = 'path';
	let pointMode = 'absolute';
	let decimalPlace = 0;
</script>

<h1 class="text-xl font-bold">SVG rect to path</h1>
<p class="mb-8">
	Paste a rect-element with required attributes(x, y, width, height) and optional attributes(e.g.
	transform).
</p>

<div class="flex flex-wrap gap-16">
	<div>
		<p class="mb-2">Select output tag.</p>
		<Radio bind:group={selectElem} value="path" checked={true} class="mb-2">&lt;path&gt;</Radio>
		<Radio bind:group={selectElem} value="polygon" class="mb-2">&lt;polygon&gt;</Radio>
		<p class="mt-8 mb-2">Select coordinate mode.</p>
		<Radio bind:group={pointMode} value="absolute" checked={true} class="mb-2">absolute</Radio>
		<Radio bind:group={pointMode} value="relative" class="mb-2">relative</Radio>
	</div>
	<div>
		<p class="mb-2">Select decimal fraction length.</p>
		{#each Array(6)
			.fill(0)
			.map((v, i) => i) as place}
			<Radio bind:group={decimalPlace} value={place} checked={decimalPlace === place} class="mb-2">
				{place === 0 ? 'integer' : `${place} (0.${'0'.repeat(place - 1)}x)`}
			</Radio>
		{/each}
	</div>
</div>
