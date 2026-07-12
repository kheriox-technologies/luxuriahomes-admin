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

	const projectDropdown = CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.DROPDOWN)
		.setFieldName('projectId')
		.setTitle('Project')
		.setOnChangeAction(
			CardService.newAction().setFunctionName('onProjectChange')
		);
	projectDropdown.addItem('Select a project…', '', !inputs.projectId);
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
		.setFieldName('folderPath')
		.setTitle('Folder');
	if (state.folders) {
		folderDropdown.addItem('/ (root)', '', !inputs.folderPath);
		for (const folder of state.folders) {
			folderDropdown.addItem(
				folder.path,
				folder.path,
				inputs.folderPath === folder.path
			);
		}
	} else {
		folderDropdown.addItem('Select a project first', '', true);
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
		.addSection(attachmentsSection)
		.addSection(destinationSection)
		.build();
}
