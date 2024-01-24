<script>
	import { Button, Textarea } from 'flowbite-svelte';
	import { convertSVGElements } from '$lib/index';

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
	let decimalPrecision = 2; // 0.0x
	let inputSVG = '';

	let outputSVG = '';

	$: if (outputElem === 'polygon') {
		// If polygon, this application only support 'relative'.
		coordMode = 'relative';
	}

	$: {
		outputSVG = convertSVGElements(inputSVG, outputElem, coordMode, decimalPrecision);
	}

	function setSampleCode() {
		inputSVG = `<rect x="387.4" y="332.4" width="4" height="40" transform="translate(-97.1 154.4) rotate(-20)" fill="#afe2b7" class="decoration" />
<rect x="10" y="85" transform="matrix(0.7837 -0.6211 0.6211 0.7837 -44.3907 110.5272)" fill="#D16B6B" width="253" height="68"/>`;
	}
</script>

<h1 class="text-4xl font-bold">SVG rect to path</h1>
<p class="mb-8">
	Paste a rect-element with required attributes(x, y, width, height) and optional attributes(e.g.
	transform).
</p>

<div class="mb-2">
	<Textarea bind:value={inputSVG} rows="6" placeholder="Paste here." class="border-primary-600">
		<div slot="footer">
			<Button color="light" size="xs" on:click={setSampleCode}>Set sample SVG</Button>
		</div>
	</Textarea>
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
					disabled={outputElem === 'polygon'}
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
		rows="6"
		class="border-primary-600 block"
		placeholder="Output."
	/>
</div>
