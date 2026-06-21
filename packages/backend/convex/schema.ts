import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { zodToConvex } from 'convex-helpers/server/zod';
import { z } from 'zod';
import {
	australianAddressValidator,
	projectClientValidator,
	projectStatusValidator,
} from './projects/shared';

export const permissionValidator = z.object({
	roleName: z.string(),
	paths: z.array(z.string()).default([]),
	actions: z.array(z.string()).default([]),
});

export const inclusionVariantClassValidator = v.union(
	v.literal('Standard'),
	v.literal('Gold'),
	v.literal('Platinum')
);

export const projectInclusionStatusValidator = v.union(
	v.literal('Under Review'),
	v.literal('Approved')
);

export const quotationStatusValidator = v.union(
	v.literal('Under Review'),
	v.literal('Approved'),
	v.literal('Rejected')
);

export const projectOrderStatusValidator = v.union(
	v.literal('Pending'),
	v.literal('Ordered'),
	v.literal('In Transit'),
	v.literal('Delivered')
);

export const projectInclusionOrderStatusValidator = v.union(
	v.literal('Order Created'),
	v.literal('Ordered'),
	v.literal('In Transit'),
	v.literal('Delivered')
);

export const scheduleDependencyTypeValidator = v.union(
	v.literal('startAfter'),
	v.literal('startWith')
);

export const projectScheduleStatusValidator = v.union(
	v.literal('Pending'),
	v.literal('In Progress'),
	v.literal('Complete')
);

export const taskStatusValidator = v.union(
	v.literal('planned'),
	v.literal('in_progress'),
	v.literal('blocked'),
	v.literal('done')
);

// Schema definition
export default defineSchema({
	permissions: defineTable(zodToConvex(permissionValidator)).index(
		'by_role_name',
		['roleName']
	),
	inclusionCategories: defineTable({
		name: v.string(),
		code: v.string(),
		count: v.number(),
		allowance: v.optional(v.number()),
		labourAllowance: v.optional(v.number()),
		searchText: v.string(),
	})
		.index('by_name', ['name'])
		.index('by_code', ['code'])
		.searchIndex('search_inclusion_categories', { searchField: 'searchText' }),
	inclusions: defineTable({
		title: v.string(),
		categoryId: v.id('inclusionCategories'),
		searchText: v.string(),
		variantCount: v.number(),
		standardPrice: v.optional(v.number()),
		standardLabourPrice: v.optional(v.number()),
		measurementUnit: v.optional(v.id('units')),
	})
		.index('by_category', ['categoryId'])
		.searchIndex('search_inclusions', { searchField: 'searchText' }),
	inclusionVariants: defineTable({
		inclusionId: v.id('inclusions'),
		class: inclusionVariantClassValidator,
		code: v.string(),
		vendor: v.string(),
		models: v.array(v.string()),
		color: v.optional(v.string()),
		details: v.optional(v.string()),
		image: v.optional(v.string()),
		link: v.optional(v.string()),
		costPrice: v.number(),
		salePrice: v.number(),
		labourPrice: v.optional(v.number()),
		searchText: v.string(),
	})
		.index('by_inclusion', ['inclusionId'])
		.index('by_code', ['code'])
		.searchIndex('search_inclusion_variants', { searchField: 'searchText' }),
	projectInclusions: defineTable({
		projectId: v.id('projects'),
		title: v.string(),
		categoryId: v.id('inclusionCategories'),
		class: inclusionVariantClassValidator,
		code: v.string(),
		vendor: v.string(),
		models: v.array(v.string()),
		color: v.optional(v.string()),
		details: v.optional(v.string()),
		image: v.optional(v.string()),
		link: v.optional(v.string()),
		costPrice: v.number(),
		salePrice: v.number(),
		labourPrice: v.optional(v.number()),
		variationPrice: v.optional(v.number()),
		locations: v.optional(
			v.array(
				v.object({
					name: v.string(),
					quantity: v.optional(v.number()),
					unit: v.optional(v.string()),
				})
			)
		),
		searchText: v.string(),
		status: v.optional(projectInclusionStatusValidator),
		orderRefId: v.optional(v.string()),
		orderStatus: v.optional(projectInclusionOrderStatusValidator),
	})
		.index('by_project', ['projectId'])
		.index('by_order_ref', ['orderRefId'])
		.searchIndex('search_project_inclusions', {
			searchField: 'searchText',
			filterFields: ['projectId'],
		}),
	projectInclusionNotes: defineTable({
		projectInclusionId: v.id('projectInclusions'),
		timestamp: v.number(),
		addedBy: v.string(),
		note: v.string(),
		images: v.optional(v.array(v.string())),
	}).index('by_project_inclusion', ['projectInclusionId']),
	projects: defineTable({
		name: v.string(),
		address: australianAddressValidator,
		status: projectStatusValidator,
		clients: v.array(projectClientValidator),
		startDate: v.optional(v.number()),
		quotePrice: v.optional(v.number()),
		expenses: v.optional(v.number()),
		searchText: v.string(),
	}).searchIndex('search_projects', { searchField: 'searchText' }),
	units: defineTable({
		category: v.string(),
		abbr: v.string(),
		label: v.string(),
	}).index('by_category', ['category']),
	projectDocumentFolders: defineTable({
		projectId: v.id('projects'),
		name: v.string(),
		path: v.string(),
		parentPath: v.string(),
	})
		.index('by_project', ['projectId'])
		.index('by_project_and_path', ['projectId', 'path'])
		.index('by_project_and_parent', ['projectId', 'parentPath']),
	projectDocuments: defineTable({
		projectId: v.id('projects'),
		name: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		folderPath: v.string(),
		size: v.optional(v.number()),
		mimeType: v.optional(v.string()),
		uploadedBy: v.string(),
		uploadedAt: v.number(),
		// Client portal: when true the document is visible on the client portal.
		clientPortalVisible: v.optional(v.boolean()),
		// True when the document was uploaded by a client via the portal.
		uploadedByClient: v.optional(v.boolean()),
	})
		.index('by_project', ['projectId'])
		.index('by_project_and_folder', ['projectId', 'folderPath']),
	companyDocumentFolders: defineTable({
		name: v.string(),
		path: v.string(),
		parentPath: v.string(),
	})
		.index('by_path', ['path'])
		.index('by_parent', ['parentPath']),
	companyDocuments: defineTable({
		name: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		folderPath: v.string(),
		size: v.optional(v.number()),
		mimeType: v.optional(v.string()),
		uploadedBy: v.string(),
		uploadedAt: v.number(),
	}).index('by_folder', ['folderPath']),
	locations: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		searchText: v.string(),
	}).searchIndex('search_locations', { searchField: 'searchText' }),
	trades: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		searchText: v.string(),
	}).searchIndex('search_trades', { searchField: 'searchText' }),
	budgetTemplates: defineTable({
		title: v.string(),
		description: v.optional(v.string()),
		// Auto-computed sum of this template's budgetTemplateItems prices.
		totalPrice: v.number(),
		searchText: v.string(),
	}).searchIndex('search_budget_templates', { searchField: 'searchText' }),
	budgetTemplateItems: defineTable({
		budgetTemplateId: v.id('budgetTemplates'),
		tradeId: v.id('trades'),
		price: v.number(),
	})
		.index('by_template', ['budgetTemplateId'])
		.index('by_template_and_trade', ['budgetTemplateId', 'tradeId']),
	projectBudgets: defineTable({
		projectId: v.id('projects'),
		tradeId: v.id('trades'),
		price: v.number(),
	})
		.index('by_project', ['projectId'])
		.index('by_project_and_trade', ['projectId', 'tradeId']),
	scheduleTemplates: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		searchText: v.string(),
	}).searchIndex('search_schedule_templates', { searchField: 'searchText' }),
	scheduleStages: defineTable({
		scheduleTemplateId: v.id('scheduleTemplates'),
		name: v.string(),
		order: v.number(),
		dependencyStageId: v.optional(v.id('scheduleStages')),
		dependencyType: v.optional(scheduleDependencyTypeValidator),
		offsetDays: v.optional(v.number()),
	})
		.index('by_schedule_template', ['scheduleTemplateId'])
		.index('by_schedule_template_order', ['scheduleTemplateId', 'order']),
	scheduleTasks: defineTable({
		scheduleTemplateId: v.id('scheduleTemplates'),
		stageId: v.id('scheduleStages'),
		name: v.string(),
		durationDays: v.number(),
		order: v.number(),
		dependencyTaskId: v.optional(v.id('scheduleTasks')),
		dependencyType: v.optional(scheduleDependencyTypeValidator),
		offsetDays: v.optional(v.number()),
	})
		.index('by_stage', ['stageId'])
		.index('by_schedule_template', ['scheduleTemplateId'])
		.index('by_stage_order', ['stageId', 'order']),
	scheduleOrderTasks: defineTable({
		scheduleTemplateId: v.id('scheduleTemplates'),
		stageId: v.id('scheduleStages'),
		parentTaskId: v.id('scheduleTasks'),
		name: v.string(),
		durationDays: v.number(),
	})
		.index('by_schedule_template', ['scheduleTemplateId'])
		.index('by_parent_task', ['parentTaskId'])
		.index('by_stage', ['stageId']),
	vendors: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		link: v.optional(v.string()),
		searchText: v.string(),
	}).searchIndex('search_vendors', { searchField: 'searchText' }),
	serviceProviders: defineTable({
		company: v.string(),
		name: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		landline: v.optional(v.string()),
		position: v.optional(v.string()),
		qbccLicense: v.optional(v.string()),
		website: v.optional(v.string()),
		address: v.optional(v.string()),
		tradeIds: v.array(v.id('trades')),
		contacts: v.array(
			v.object({
				name: v.string(),
				email: v.optional(v.string()),
				phone: v.optional(v.string()),
				landline: v.optional(v.string()),
				position: v.optional(v.string()),
			})
		),
		searchText: v.string(),
	}).searchIndex('search_service_providers', { searchField: 'searchText' }),
	projectServiceProviders: defineTable({
		projectId: v.id('projects'),
		serviceProviderId: v.id('serviceProviders'),
	})
		.index('by_project', ['projectId'])
		.index('by_service_provider', ['serviceProviderId'])
		.index('by_project_and_service_provider', [
			'projectId',
			'serviceProviderId',
		]),
	materialColors: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		searchText: v.string(),
	}).searchIndex('search_material_colors', { searchField: 'searchText' }),
	documentFolders: defineTable({
		name: v.string(),
		searchText: v.string(),
	}).searchIndex('search_document_folders', { searchField: 'searchText' }),
	projectQuotations: defineTable({
		projectId: v.id('projects'),
		title: v.string(),
		tradeId: v.id('trades'),
		serviceProviderId: v.id('serviceProviders'),
		s3Key: v.optional(v.string()),
		price: v.number(),
		status: quotationStatusValidator,
		searchText: v.string(),
	})
		.index('by_project', ['projectId'])
		.index('by_trade', ['tradeId'])
		.searchIndex('search_project_quotations', { searchField: 'searchText' }),
	projectQuotationNotes: defineTable({
		projectQuotationId: v.id('projectQuotations'),
		timestamp: v.number(),
		addedBy: v.string(),
		note: v.string(),
		images: v.optional(v.array(v.string())),
	}).index('by_project_quotation', ['projectQuotationId']),
	materials: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		tradeId: v.id('trades'),
		unit: v.id('units'),
		price: v.number(),
		vendor: v.string(),
		sku: v.optional(v.string()),
		link: v.optional(v.string()),
		searchText: v.string(),
	})
		.index('by_name', ['name'])
		.index('by_trade', ['tradeId'])
		.searchIndex('search_materials', { searchField: 'searchText' }),
	materialItems: defineTable({
		materialId: v.id('materials'),
		name: v.string(),
		description: v.optional(v.string()),
		vendor: v.string(),
		unit: v.id('units'),
		price: v.number(),
		quantity: v.optional(v.number()),
		sku: v.optional(v.string()),
		link: v.optional(v.string()),
		searchText: v.string(),
	})
		.index('by_material', ['materialId'])
		.searchIndex('search_material_items', { searchField: 'searchText' }),
	projectOrders: defineTable({
		orderId: v.string(),
		projectId: v.id('projects'),
		vendor: v.string(),
		tradeId: v.id('trades'),
		orderBy: v.optional(v.number()),
		deliverBy: v.optional(v.number()),
		orderTaskId: v.optional(v.id('projectOrderTasks')),
		items: v.array(
			v.object({
				name: v.string(),
				description: v.optional(v.string()),
				quantity: v.number(),
				unit: v.string(),
				price: v.optional(v.number()),
				sku: v.optional(v.string()),
				link: v.optional(v.string()),
			})
		),
		status: projectOrderStatusValidator,
		searchText: v.string(),
	})
		.index('by_project', ['projectId'])
		.index('by_order_id', ['orderId'])
		.index('by_order_task', ['orderTaskId'])
		.searchIndex('search_project_orders', {
			searchField: 'searchText',
			filterFields: ['projectId'],
		}),
	projectOrderStatusHistory: defineTable({
		orderId: v.id('projectOrders'),
		status: projectOrderStatusValidator,
		label: v.string(),
		changedBy: v.string(),
		timestamp: v.number(),
	}).index('by_order', ['orderId']),
	projectOrderNotes: defineTable({
		orderId: v.id('projectOrders'),
		timestamp: v.number(),
		addedBy: v.string(),
		note: v.string(),
		images: v.optional(v.array(v.string())),
	}).index('by_order', ['orderId']),
	projectStages: defineTable({
		projectId: v.id('projects'),
		name: v.string(),
		order: v.number(),
		dependencyStageId: v.optional(v.id('projectStages')),
		dependencyType: v.optional(scheduleDependencyTypeValidator),
		offsetDays: v.optional(v.number()),
		startDate: v.number(),
		endDate: v.number(),
		status: projectScheduleStatusValidator,
	})
		.index('by_project', ['projectId'])
		.index('by_project_order', ['projectId', 'order']),
	projectTasks: defineTable({
		projectId: v.id('projects'),
		stageId: v.id('projectStages'),
		name: v.string(),
		durationDays: v.number(),
		order: v.number(),
		dependencyTaskId: v.optional(v.id('projectTasks')),
		dependencyType: v.optional(scheduleDependencyTypeValidator),
		offsetDays: v.optional(v.number()),
		startDate: v.number(),
		endDate: v.number(),
		status: projectScheduleStatusValidator,
	})
		.index('by_project', ['projectId'])
		.index('by_stage', ['stageId'])
		.index('by_stage_order', ['stageId', 'order']),
	projectOrderTasks: defineTable({
		projectId: v.id('projects'),
		stageId: v.id('projectStages'),
		parentTaskId: v.id('projectTasks'),
		name: v.string(),
		durationDays: v.number(),
	})
		.index('by_project', ['projectId'])
		.index('by_parent_task', ['parentTaskId'])
		.index('by_stage', ['stageId']),
	emailSignatures: defineTable({
		name: v.string(),
		content: v.string(),
		isDefault: v.boolean(),
		searchText: v.string(),
	}).searchIndex('search_email_signatures', { searchField: 'searchText' }),
	emailTemplates: defineTable({
		name: v.string(),
		subject: v.string(),
		body: v.string(),
		signatureId: v.optional(v.id('emailSignatures')),
		isActive: v.boolean(),
		searchText: v.string(),
	}).searchIndex('search_email_templates', { searchField: 'searchText' }),
	sentEmails: defineTable({
		to: v.array(v.string()),
		cc: v.optional(v.array(v.string())),
		bcc: v.optional(v.array(v.string())),
		subject: v.string(),
		sentBy: v.string(),
		gmailMessageId: v.string(),
		gmailThreadId: v.string(),
		attachmentNames: v.array(v.string()),
		projectId: v.optional(v.id('projects')),
		relatedTable: v.optional(v.string()),
		relatedId: v.optional(v.string()),
		timestamp: v.number(),
	})
		.index('by_project', ['projectId'])
		.index('by_timestamp', ['timestamp']),
	notifications: defineTable({
		type: v.union(
			v.literal('inclusion_approved'),
			v.literal('inclusion_unapproved'),
			v.literal('inclusion_note'),
			v.literal('document_upload')
		),
		message: v.string(),
		fromName: v.string(),
		fromEmail: v.optional(v.string()),
		// Relative deep-link into the admin app, opened in a new tab.
		link: v.optional(v.string()),
		read: v.boolean(),
		projectId: v.optional(v.id('projects')),
	}).index('by_read', ['read']),
	tasks: defineTable({
		title: v.string(),
		description: v.optional(v.string()),
		status: taskStatusValidator,
		dueDate: v.optional(v.number()),
		projectId: v.optional(v.id('projects')),
		// Clerk user id of the assigned admin (see adminUsers table).
		assigneeUserId: v.optional(v.string()),
		// Position of the card within its status lane (ascending).
		order: v.number(),
		createdBy: v.string(),
		searchText: v.string(),
	})
		.index('by_status', ['status'])
		.searchIndex('search_tasks', { searchField: 'searchText' }),
	taskNotes: defineTable({
		taskId: v.id('tasks'),
		timestamp: v.number(),
		addedBy: v.string(),
		note: v.string(),
		images: v.optional(v.array(v.string())),
	}).index('by_task', ['taskId']),
	// Cached snapshot of Clerk users with the admin role, refreshed by a cron
	// (convex/crons.ts) so the tasks UI can pick assignees without hitting Clerk.
	adminUsers: defineTable({
		userId: v.string(),
		fullName: v.string(),
		email: v.string(),
		syncedAt: v.number(),
	}).index('by_user', ['userId']),
});
