<div class="container mt-3 mb-5">
	<slot />

	<div
		class="offcanvas offcanvas-start"
		tabindex="-1"
		id="offcanvasExample"
		aria-labelledby="offcanvasExampleLabel"
	>
		<div class="offcanvas-header">
			<h5 class="offcanvas-title" id="offcanvasExampleLabel">Навигация</h5>
			<button
				type="button"
				class="btn-close text-reset"
				data-bs-dismiss="offcanvas"
				aria-label="Закрыть"
			/>
		</div>
		<div class="offcanvas-body">
			<button class="btn btn-light text-start w-100 mb-1">Мои заказы</button>
			<button class="btn btn-light text-start w-100">Мой профиль</button>
			<button class="btn btn-light" style="position: fixed; left:1em; bottom:1em"
				>Выйти из профиля</button
			>
		</div>
	</div>
</div>
