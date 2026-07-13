// Card builders for the Gmail add-on sidebar UI.

const BYTES_PER_KB = 1024;

function formatSize_(bytes) {
	if (!bytes && bytes !== 0) {
		return '';
	}
	if (bytes < BYTES_PER_KB) {
		return `${bytes} B`;
	}
	if (bytes < BYTES_PER_KB * BYTES_PER_KB) {
		return `${(bytes / BYTES_PER_KB).toFixed(1)} KB`;
	}
	return `${(bytes / (BYTES_PER_KB * BYTES_PER_KB)).toFixed(1)} MB`;
}

// Filing-type toggle shown at the top of both cards: Document (default) files
// the attachment into project documents; Quotation creates a project quotation.
function buildTypeSection_(filingType) {
	const toggle = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.RADIO_BUTTON)
		.setFieldName('filingType')
		.setOnChangeAction(
			CardService.newAction().setFunctionName('onFilingTypeChange')
		);
	toggle.addItem('Document', 'document', filingType !== 'quotation');
	toggle.addItem('Quotation', 'quotation', filingType === 'quotation');
	return CardService.newCardSection().setHeader('Type').addWidget(toggle);
}

function buildNoAttachmentsCard_() {
	return CardService.newCardBuilder()
		.setHeader(CardService.newCardHeader().setTitle('Luxuria Documents'))
		.addSection(
			CardService.newCardSection().addWidget(
				CardService.newTextParagraph().setText(
					'No attachments on this message.'
				)
			)
		)
		.build();
}

// state: { attachments: [{name, size}], projects: [{id, name}],
//          folders: [{path, name}] | null, inputs: {projectId, folderPath,
//          attachments: [indexStrings], newFolderName} }
function buildFilingCard_(state) {
	const inputs = state.inputs || {};
	const selectedAttachments = inputs.attachments || [];

	const attachmentsSection =
		CardService.newCardSection().setHeader('Attachments');
	const checkboxes = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.CHECK_BOX)
		.setFieldName('attachments');
	state.attachments.forEach((attachment, index) => {
		const value = String(index);
		const selected =
			state.attachments.length === 1 || selectedAttachments.includes(value);
		checkboxes.addItem(
			`${attachment.name} (${formatSize_(attachment.size)})`,
			value,
			selected
		);
	});
	attachmentsSection.addWidget(checkboxes);

	const destinationSection =
		CardService.newCardSection().setHeader('Destination');

	// No setTitle() on the dropdowns: Gmail draws the floating title on top of
	// the selected value (overlapping text); placeholder items label them.
	const projectDropdown = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.DROPDOWN)
		.setFieldName('projectId')
		.setOnChangeAction(
			CardService.newAction().setFunctionName('onProjectChange')
		);
	projectDropdown.addItem('Project: select…', '', !inputs.projectId);
	for (const project of state.projects) {
		projectDropdown.addItem(
			project.name,
			project.id,
			inputs.projectId === project.id
		);
	}
	destinationSection.addWidget(projectDropdown);

	const folderDropdown = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.DROPDOWN)
		.setFieldName('folderPath');
	if (state.folders) {
		folderDropdown.addItem('Folder: / (root)', '', !inputs.folderPath);
		for (const folder of state.folders) {
			folderDropdown.addItem(
				folder.path,
				folder.path,
				inputs.folderPath === folder.path
			);
		}
	} else {
		folderDropdown.addItem('Folder: select a project first', '', true);
	}
	destinationSection.addWidget(folderDropdown);

	destinationSection.addWidget(
		CardService.newTextInput()
			.setFieldName('newFolderName')
			.setTitle('New subfolder (optional)')
			.setHint('Created inside the selected folder')
	);

	destinationSection.addWidget(
		CardService.newTextButton()
			.setText('Add to project')
			.setOnClickAction(CardService.newAction().setFunctionName('onSubmit'))
	);

	return CardService.newCardBuilder()
		.setHeader(
			CardService.newCardHeader().setTitle('Add attachments to project')
		)
		.addSection(buildTypeSection_('document'))
		.addSection(attachmentsSection)
		.addSection(destinationSection)
		.build();
}

// state: { attachments: [{name, size}], projects: [{id, name}],
//          trades: [{id, name}], serviceProviders: [{id, company, name}] | null,
//          inputs: {projectId, title, tradeId, serviceProviderId, price,
//          attachment: indexString} }
function buildQuotationCard_(state) {
	const inputs = state.inputs || {};

	const attachmentSection =
		CardService.newCardSection().setHeader('Attachment');
	const radios = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.RADIO_BUTTON)
		.setFieldName('attachment');
	state.attachments.forEach((attachment, index) => {
		const value = String(index);
		const selected =
			state.attachments.length === 1 || inputs.attachment === value;
		radios.addItem(
			`${attachment.name} (${formatSize_(attachment.size)})`,
			value,
			selected
		);
	});
	attachmentSection.addWidget(radios);

	const detailsSection = CardService.newCardSection().setHeader('Quotation');

	const projectDropdown = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.DROPDOWN)
		.setFieldName('projectId');
	projectDropdown.addItem('Project: select…', '', !inputs.projectId);
	for (const project of state.projects) {
		projectDropdown.addItem(
			project.name,
			project.id,
			inputs.projectId === project.id
		);
	}
	detailsSection.addWidget(projectDropdown);

	const titleInput = CardService.newTextInput()
		.setFieldName('title')
		.setTitle('Title');
	if (inputs.title) {
		titleInput.setValue(inputs.title);
	}
	detailsSection.addWidget(titleInput);

	const tradeDropdown = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.DROPDOWN)
		.setFieldName('tradeId')
		.setOnChangeAction(
			CardService.newAction().setFunctionName('onTradeChange')
		);
	tradeDropdown.addItem('Trade: select…', '', !inputs.tradeId);
	for (const trade of state.trades) {
		tradeDropdown.addItem(trade.name, trade.id, inputs.tradeId === trade.id);
	}
	detailsSection.addWidget(tradeDropdown);

	const providerDropdown = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.DROPDOWN)
		.setFieldName('serviceProviderId');
	if (state.serviceProviders) {
		providerDropdown.addItem(
			'Service provider: select…',
			'',
			!inputs.serviceProviderId
		);
		for (const provider of state.serviceProviders) {
			const label = provider.company
				? `${provider.company} — ${provider.name}`
				: provider.name;
			providerDropdown.addItem(
				label,
				provider.id,
				inputs.serviceProviderId === provider.id
			);
		}
	} else {
		providerDropdown.addItem(
			'Service provider: select a trade first',
			'',
			true
		);
	}
	detailsSection.addWidget(providerDropdown);

	const priceInput = CardService.newTextInput()
		.setFieldName('price')
		.setTitle('Price')
		.setHint('Amount, e.g. 1500.00');
	if (inputs.price) {
		priceInput.setValue(inputs.price);
	}
	detailsSection.addWidget(priceInput);

	detailsSection.addWidget(
		CardService.newTextButton()
			.setText('Add quotation')
			.setOnClickAction(
				CardService.newAction().setFunctionName('onSubmitQuotation')
			)
	);

	return CardService.newCardBuilder()
		.setHeader(CardService.newCardHeader().setTitle('Add quotation to project'))
		.addSection(buildTypeSection_('quotation'))
		.addSection(attachmentSection)
		.addSection(detailsSection)
		.build();
}
