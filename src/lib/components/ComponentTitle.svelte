<script>
	export let title = '';
</script>

<div class="d-flex justify-content-between align-items-center mb-3">
	<div class="d-flex align-items-center">
		<button
			class="btn btn-light me-1"
			data-bs-toggle="offcanvas"
			data-bs-target="#offcanvasExample"
			data-bs-backdrop="false"><i class="fa-solid fa-bars" /></button
		>
		<h3 class="m-0 p-0">{title}</h3>
	</div>
	<slot />
</div>
