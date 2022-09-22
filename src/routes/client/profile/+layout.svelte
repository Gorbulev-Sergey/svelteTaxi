<script>
	import { auth } from '$lib/scripts/firebase';
</script>

<div class="offcanvas offcanvas-start" data-bs-backdrop="false" tabindex="-1" id="offcanvasExample">
	<div class="offcanvas-header">
		<div class="d-flex justify-content-between align-items-start">
			<div class="d-flex justify-content-start">
				<img class="img-fluid w-25 ms-3 mt-2" src="https://libmir.com/i/13/285513/_18.jpg" alt="" />
			</div>
			<button
				type="button"
				class="btn-close text-reset"
				data-bs-dismiss="offcanvas"
				aria-label="Закрыть"
			/>
		</div>
	</div>
	<div class="offcanvas-body">
		<div class="list-group list-group-flush">
			<a class="list-group-item list-group-item-action" href="/client/profile">Профиль</a>
			<a class="list-group-item list-group-item-action" href="/client/order">Мои заказы</a>
			<button class="list-group-item list-group-item-action" on:click={() => auth.signOut()}
				>Выход</button
			>
		</div>
	</div>
</div>

<slot />
