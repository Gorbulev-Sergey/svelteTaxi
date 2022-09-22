<script>
	import { goto } from '$app/navigation';
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';
	import { auth } from '$lib/scripts/firebase';
</script>

<div class="container mt-3 mb-5">
	<slot />

	<ComponentAuth>
		<div
			class="offcanvas offcanvas-start"
			data-bs-backdrop="false"
			tabindex="-1"
			id="offcanvasExample"
		>
			<div class="offcanvas-header">
				<img class="img-fluid w-25 ms-3 mt-2" src={auth.currentUser?.photoURL} alt="" />
				<button
					type="button"
					class="btn-close text-reset"
					data-bs-dismiss="offcanvas"
					aria-label="Закрыть"
				/>
			</div>
			<div class="offcanvas-body">
				<div class="list-group list-group-flush">
					<button
						class="list-group-item list-group-item-action"
						data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasExample"
						on:click={() => goto('/client/profile')}>Профиль</button
					>
					<button
						class="list-group-item list-group-item-action"
						data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasExample"
						on:click={() => goto('/client/order')}>Мои заказы</button
					>
					<button class="list-group-item list-group-item-action" on:click={() => auth.signOut()}
						>Выход</button
					>
				</div>
			</div>
		</div>
	</ComponentAuth>
</div>
