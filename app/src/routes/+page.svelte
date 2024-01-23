<script>
	import { Button, Textarea } from 'flowbite-svelte';

	const outputElemSelects = [
		{ value: 'path', label: '<path>' },
		{ value: 'polygon', label: '<polygon>' }
	];
	const coordModeSelects = [
		{ value: 'absolute', label: 'absolute' },
		{ value: 'relative', label: 'relative' }
	];
	const decimalPrecisionSelects = Array(5)
		.fill(0)
		.map((v, i) => ({
			value: i,
			label: i === 0 ? 'integer' : `0.${'0'.repeat(i - 1)}x`
		}));

	let outputElem = outputElemSelects[0].value;
	let coordMode = coordModeSelects[0].value;
	let decimalPrecision = decimalPrecisionSelects[0].value;
	let inputSVG = '';

	let outputSVG = '';
</script>

<h1 class="text-4xl font-bold">SVG rect to path</h1>
<p class="mb-8">
	Paste a rect-element with required attributes(x, y, width, height) and optional attributes(e.g.
	transform).
</p>

<div class="mb-2">
	<Textarea bind:value={inputSVG} rows="8" placeholder="Paste here." class="border-primary-600" />
</div>
<div class="mb-8 flex flex-wrap gap-8">
	<div>
		<p class="mb-2">Output tag</p>
		<div class="flex flex-wrap gap-2">
			{#each outputElemSelects as elem}
				<Button
					color={outputElem === elem.value ? 'primary' : 'light'}
					class="text-lg"
					on:click={() => (outputElem = elem.value)}
				>
					{elem.label}
				</Button>
			{/each}
		</div>
	</div>
	<div>
		<p class="mb-2">Coordinate mode</p>
		<div class="flex flex-wrap gap-2">
			{#each coordModeSelects as mode}
				<Button
					color={coordMode === mode.value ? 'primary' : 'light'}
					class="text-lg"
					on:click={() => (coordMode = mode.value)}
				>
					{mode.label}
				</Button>
			{/each}
		</div>
	</div>
</div>
<p class="mb-2">Decimal fraction length</p>
<div class="mb-8 flex flex-wrap gap-2">
	{#each decimalPrecisionSelects as len}
		<Button
			color={decimalPrecision === len.value ? 'primary' : 'light'}
			class="text-lg"
			on:click={() => (decimalPrecision = len.value)}
		>
			{len.label}
		</Button>
	{/each}
</div>

<div class={outputSVG && 'border-primary-600 rounded-xl border-4 p-1'}>
	<Textarea
		bind:value={outputSVG}
		readonly
		rows="12"
		class="border-primary-600 block"
		placeholder="Output."
	/>
</div>
