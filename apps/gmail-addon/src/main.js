// Entry points for the Gmail add-on: contextual trigger + card actions.

const LH_APP_LABEL = 'LH APP';

// Gets (or creates) the "LH APP" label and applies it to the current thread.
function applyFiledLabel_(e) {
	const label =
		GmailApp.getUserLabelByName(LH_APP_LABEL) ||
		GmailApp.createLabel(LH_APP_LABEL);
	GmailApp.getMessageById(e.gmail.messageId).getThread().addLabel(label);
}

function getAttachments_(e) {
	GmailApp.setCurrentMessageAccessToken(e.gmail.accessToken);
	const message = GmailApp.getMessageById(e.gmail.messageId);
	return message.getAttachments({ includeInlineImages: false });
}

function summarizeAttachments_(attachments) {
	return attachments.map((attachment) => ({
		name: attachment.getName(),
		size: attachment.getSize(),
	}));
}

function normalizeSelection_(value) {
	if (!value) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
}

function notify_(text) {
	return CardService.newActionResponseBuilder()
		.setNotification(CardService.newNotification().setText(text))
		.build();
}

function onGmailMessageOpen(e) {
	const attachments = getAttachments_(e);
	if (attachments.length === 0) {
		return buildNoAttachmentsCard_();
	}
	const projects = fetchProjects_();
	return buildFilingCard_({
		attachments: summarizeAttachments_(attachments),
		projects,
		folders: null,
		inputs: {},
	});
}

function updateCard_(card) {
	return CardService.newActionResponseBuilder()
		.setNavigation(CardService.newNavigation().updateCard(card))
		.build();
}

function quotationInputs_(e) {
	const input = e.formInput || {};
	return {
		projectId: input.projectId,
		title: input.title,
		tradeId: input.tradeId,
		serviceProviderId: input.serviceProviderId,
		price: input.price,
		attachment: input.attachment,
	};
}

// Derives a file extension from the filename, falling back to the MIME subtype.
function fileExtension_(name, contentType) {
	const dot = name.lastIndexOf('.');
	if (dot > 0 && dot < name.length - 1) {
		return name.slice(dot + 1).toLowerCase();
	}
	const slash = (contentType || '').lastIndexOf('/');
	if (slash !== -1) {
		return contentType.slice(slash + 1).toLowerCase();
	}
	return 'bin';
}

// Rebuilds the card when the user switches between Document and Quotation.
function onFilingTypeChange(e) {
	const filingType = e.formInput.filingType;
	const attachments = summarizeAttachments_(getAttachments_(e));
	const projects = fetchProjects_();

	if (filingType === 'quotation') {
		const tradeId = e.formInput.tradeId;
		const card = buildQuotationCard_({
			attachments,
			projects,
			trades: fetchTrades_(),
			serviceProviders: tradeId ? fetchServiceProviders_(tradeId) : null,
			inputs: quotationInputs_(e),
		});
		return updateCard_(card);
	}

	const projectId = e.formInput.projectId;
	const folders = projectId ? fetchFolders_(projectId).folders : null;
	const card = buildFilingCard_({
		attachments,
		projects,
		folders,
		inputs: {
			projectId,
			attachments: normalizeSelection_(e.formInputs.attachments),
		},
	});
	return updateCard_(card);
}

// Reloads the service-provider dropdown when the trade changes.
function onTradeChange(e) {
	const tradeId = e.formInput.tradeId;
	const inputs = quotationInputs_(e);
	// The previously selected provider may not offer the new trade.
	inputs.serviceProviderId = undefined;
	const card = buildQuotationCard_({
		attachments: summarizeAttachments_(getAttachments_(e)),
		projects: fetchProjects_(),
		trades: fetchTrades_(),
		serviceProviders: tradeId ? fetchServiceProviders_(tradeId) : null,
		inputs,
	});
	return updateCard_(card);
}

function onSubmitQuotation(e) {
	const input = e.formInput || {};
	const projectId = input.projectId;
	const title = (input.title || '').trim();
	const tradeId = input.tradeId;
	const serviceProviderId = input.serviceProviderId;
	const priceRaw = (input.price || '').trim();
	const attachmentIndex = input.attachment;

	if (!projectId) {
		return notify_('Select a project first.');
	}
	if (!title) {
		return notify_('Enter a title.');
	}
	if (!tradeId) {
		return notify_('Select a trade.');
	}
	if (!serviceProviderId) {
		return notify_('Select a service provider.');
	}
	const price = Number(priceRaw);
	if (!(priceRaw && Number.isFinite(price))) {
		return notify_('Enter a valid price.');
	}
	if (attachmentIndex === undefined || attachmentIndex === '') {
		return notify_('Select an attachment.');
	}

	const attachment = getAttachments_(e)[Number(attachmentIndex)];
	if (!attachment) {
		return notify_('Selected attachment not found.');
	}

	try {
		const contentType = attachment.getContentType();
		const ext = fileExtension_(attachment.getName(), contentType);
		const prep = prepareQuotationUpload_({ projectId, contentType, ext });

		const putResponse = UrlFetchApp.fetch(prep.uploadUrl, {
			method: 'put',
			contentType,
			payload: attachment.copyBlob().getBytes(),
			muteHttpExceptions: true,
		});
		if (putResponse.getResponseCode() !== 200) {
			throw new Error(`S3 upload failed (${putResponse.getResponseCode()})`);
		}

		createQuotation_({
			projectId,
			title,
			tradeId,
			serviceProviderId,
			price,
			s3Key: prep.s3Key,
		});
	} catch (error) {
		return notify_(`Failed to add quotation: ${error.message}`);
	}

	const project = fetchProjects_().filter((p) => p.id === projectId)[0];
	const projectName = project ? project.name : 'project';

	try {
		applyFiledLabel_(e);
	} catch (labelError) {
		return notify_(
			`Added quotation "${title}" to ${projectName} (label not applied)`
		);
	}
	return notify_(`Added quotation "${title}" to ${projectName}`);
}

function onProjectChange(e) {
	const projectId = e.formInput.projectId;
	const attachments = summarizeAttachments_(getAttachments_(e));
	const projects = fetchProjects_();
	const folders = projectId ? fetchFolders_(projectId).folders : null;
	const card = buildFilingCard_({
		attachments,
		projects,
		folders,
		inputs: {
			projectId,
			attachments: normalizeSelection_(e.formInputs.attachments),
		},
	});
	return CardService.newActionResponseBuilder()
		.setNavigation(CardService.newNavigation().updateCard(card))
		.build();
}

function onSubmit(e) {
	const projectId = e.formInput.projectId;
	if (!projectId) {
		return notify_('Select a project first.');
	}
	const selected = normalizeSelection_(e.formInputs.attachments);
	if (selected.length === 0) {
		return notify_('Select at least one attachment.');
	}

	const attachments = getAttachments_(e);
	const userEmail = Session.getActiveUser().getEmail();
	const newFolderName = (e.formInput.newFolderName || '').trim();
	let folderPath = e.formInput.folderPath || '';
	let ensuredFolder = false;
	const succeeded = [];
	const failed = [];

	for (const value of selected) {
		const attachment = attachments[Number(value)];
		if (!attachment) {
			failed.push(value);
			continue;
		}
		try {
			const prep = prepareUpload_({
				projectId,
				folderPath,
				fileName: attachment.getName(),
				contentType: attachment.getContentType(),
				newFolderName: ensuredFolder ? undefined : newFolderName || undefined,
			});
			// Reuse the (possibly newly created) folder for subsequent files.
			folderPath = prep.folderPath;
			ensuredFolder = true;

			const putResponse = UrlFetchApp.fetch(prep.uploadUrl, {
				method: 'put',
				contentType: attachment.getContentType(),
				payload: attachment.copyBlob().getBytes(),
				muteHttpExceptions: true,
			});
			if (putResponse.getResponseCode() !== 200) {
				throw new Error(`S3 upload failed (${putResponse.getResponseCode()})`);
			}

			completeUpload_({
				projectId,
				name: attachment.getName(),
				kebabName: prep.kebabName,
				s3Key: prep.s3Key,
				folderPath: prep.folderPath,
				size: attachment.getSize(),
				mimeType: attachment.getContentType(),
				uploadedBy: userEmail,
			});
			succeeded.push(attachment.getName());
		} catch (error) {
			failed.push(`${attachment.getName()}: ${error.message}`);
		}
	}

	const projects = fetchProjects_();
	const project = projects.filter((p) => p.id === projectId)[0];
	const projectName = project ? project.name : 'project';
	const destination = folderPath || 'root';

	if (failed.length === 0) {
		try {
			applyFiledLabel_(e);
		} catch (labelError) {
			// Filing succeeded; labeling is best-effort, so don't fail the action.
			return notify_(
				`Filed ${succeeded.length} file(s) to ${projectName} / ${destination} (label not applied)`
			);
		}
		return notify_(
			`Filed ${succeeded.length} file(s) to ${projectName} / ${destination}`
		);
	}
	return notify_(
		`${succeeded.length} succeeded, ${failed.length} failed: ${failed.join('; ')}`
	);
}
