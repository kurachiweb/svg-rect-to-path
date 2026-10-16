<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button, Textarea, Toast } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { convertSVGElements } from '#lib';

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

	let outputElem = $state(outputElemSelects[0].value);
	let coordMode = $state(coordModeSelects[0].value);
	let decimalPrecision = $state(2); // 0.0x
	let inputSVG = $state('');

	const outputSVG = $derived(convertSVGElements(inputSVG, outputElem, coordMode, decimalPrecision));

	function selectOutputElem(value: string) {
		outputElem = value;
		if (value === 'polygon') {
			// If polygon, this application only support 'relative'.
			coordMode = 'relative';
		}
	}

	function setSampleCode() {
		inputSVG = `<rect x="387.4" y="332.4" width="4" height="40" transform="translate(-97.1 154.4) rotate(-20)" fill="#afe2b7" class="decoration" />
<rect x="10" y="85" transform="matrix(0.7837 -0.6211 0.6211 0.7837 -44.3907 110.5272)" fill="#D16B6B" width="253" height="68"/>`;
	}

	let isCopySuccess = $state(false);
	let isCopyFail = $state(false);
	function copyOutput() {
		navigator.clipboard
			.writeText(outputSVG)
			.then(() => (isCopySuccess = true))
			.catch(() => (isCopyFail = true));
	}
</script>

<h1 class="text-4xl font-bold">SVG rect to path</h1>
<p class="mb-8">
	Paste a rect-element with required attributes(x, y, width, height) and optional attributes(e.g.
	transform).
</p>

<div class="mb-2">
	<Textarea bind:value={inputSVG} rows={6} placeholder="Paste here" class="border-primary-600">
		{#snippet footer()}
			<Button color="light" size="xs" onclick={setSampleCode}>Set sample SVG</Button>
		{/snippet}
	</Textarea>
</div>
<div class="mb-8 flex flex-wrap gap-8">
	<div>
		<p class="mb-2">Output tag</p>
		<div class="flex flex-wrap gap-2">
			{#each outputElemSelects as elem (elem.value)}
				<Button
					color={outputElem === elem.value ? 'primary' : 'light'}
					class="text-lg"
					onclick={() => selectOutputElem(elem.value)}
				>
					{elem.label}
				</Button>
			{/each}
		</div>
	</div>
	<div>
		<p class="mb-2">Coordinate mode</p>
		<div class="flex flex-wrap gap-2">
			{#each coordModeSelects as mode (mode.value)}
				<Button
					color={coordMode === mode.value ? 'primary' : 'light'}
					disabled={outputElem === 'polygon'}
					class="text-lg"
					onclick={() => (coordMode = mode.value)}
				>
					{mode.label}
				</Button>
			{/each}
		</div>
	</div>
</div>
<p class="mb-2">Decimal fraction length</p>
<div class="mb-8 flex flex-wrap gap-2">
	{#each decimalPrecisionSelects as len (len.value)}
		<Button
			color={decimalPrecision === len.value ? 'primary' : 'light'}
			class="text-lg"
			onclick={() => (decimalPrecision = len.value)}
		>
			{len.label}
		</Button>
	{/each}
</div>

<div class="mb-8 {outputSVG && 'rounded-xl border-4 border-primary-600 p-1'}">
	<Textarea
		value={outputSVG}
		readonly
		rows={6}
		class="block border-primary-600"
		placeholder="Output"
	>
		{#snippet footer()}
			<div class="flex flex-wrap gap-x-4 gap-y-2">
				<Button color="primary" disabled={!outputSVG} size="sm" onclick={copyOutput}>
					Copy SVG
				</Button>
				{#if isCopySuccess}
					<div in:fade out:fade={{ delay: 4000 }} onintroend={() => (isCopySuccess = false)}>
						<Toast color="green" dismissable={false} class="p-1 pr-3">
							{#snippet icon()}
								<CheckCircleSolid class="h-5 w-5" />
								<span class="sr-only">Check icon</span>
							{/snippet}
							Successfully copied.
						</Toast>
					</div>
				{:else if isCopyFail}
					<div in:fade out:fade={{ delay: 4000 }} onintroend={() => (isCopyFail = false)}>
						<Toast color="red" dismissable={false} class="p-1 pr-3">
							{#snippet icon()}
								<CloseCircleSolid class="h-5 w-5" />
								<span class="sr-only">Error icon</span>
							{/snippet}
							Sorry, Failed to copy. Please try it self.
						</Toast>
					</div>
				{/if}
			</div>
		{/snippet}
	</Textarea>
</div>

<p class="mb-2">
	This application is using <a
		href="https://svelte.dev/"
		target="_blank"
		class="text-primary-800 underline">Svelte</a
	>,
	<a
		href="https://svelte.jp/docs/kit/introduction"
		target="_blank"
		class="text-primary-800 underline">SvelteKit</a
	>,
	<a href="https://flowbite-svelte.com/" target="_blank" class="text-primary-800 underline"
		>Flowbite</a
	>
</p>
<div class="flex flex-wrap items-center gap-2">
	<p>2020-{new Date().getFullYear()} @KurachiWeb</p>
	<Button color="dark" size="sm" href="https://github.com/kurachiweb/svg-rect-to-path">
		Fork me on GitHub
	</Button>
</div>
