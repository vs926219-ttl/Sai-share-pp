// eslint-disable-next-line import/prefer-default-export
/* eslint-disable no-useless-escape */
export const ENV_TYPES = {
  TEST: 'TEST',
  PRODUCTION: 'PRODUCTION',
};

export const MESSAGE_TYPE = {
  SUCCESS: 'Success',
  FAILURE: 'Fail',
  INFORMATION: 'Information',
  INTERNAL_ERROR: 'Internal Error',
  LOADING: 'Loading',
};

export const DISPLAY_MESSAGES = {
  PROJECT_CREATION_FAILURE: 'Project Creation failed. Pls try again.',
  PROJECT_UPDATE_FAILURE: 'Project Update failed. Pls try again.',
  PROJECT_DETAILS_FAILURE: 'Project Details not found. Pls try again.',
  PPAP_INITIATION_FAILURE: 'Unable to Initiate PPAP. Pls try again.',
  PPAP_TERMINATION_FAILURE: 'Unable to Terminate PPAP. Pls try again.',
  APQP_SUBMISSION_FAILURE: 'Unable to Submit APQP Timing Chart. Pls try again.',
  APQP_APPROVAL_FAILURE: 'Unable to Approve APQP Timing Chart. Pls try again.',
  PIST_APPROVAL_FAILURE: 'Unable to Approve PIST stage. Pls try again.',
  STAGE_REQUIREMENT_SUBMIT_FAILURE: 'Unable to Submit Stage Requirements. Pls try again.',
  AUTHORISATION_ERROR: 'Authorisation error. Please contact IT team for more information.',
  NETWORK_ERROR: 'Please check your network and Try again.',
  PRIMARY_ERROR: 'oops looks like something has gone wrong please try again',
  DELETE_FILE: 'Unable to delete file. Pls try again.',
  PPAP_REVISION_FAILURE: 'Unable to Revise PPAP. Pls try again.',
  PPAP_APPROVAL_FAILURE: 'Unable to Approve PPAP. Pls try again.',
  DOCUMENT_SUBMIT_FAILURE: 'Unable to Submit. Pls try again.',
  DOWNLOAD_FAIL: 'Unable to download document. Pls try again.'
}

export const LOG_LEVEL = {
  INFO: { name: 'INFO', value: 1 },
  WARN: { name: 'WARN', value: 2 },
  ERROR: { name: 'ERROR', value: 3 },
};

export const API_RESOURCE_URLS = {
  LOG_ERROR: 'logs/v2',
  AUTH_BULK_RESOURCE: 'authorization/bulk-allowed-resources',
  PROJECTS: 'ppap/projects', 
  PROCESS: 'ppap/ppap',
  PURCHASE_ORDER: 'ppap/purchaseOrders',
  TASKS: '/ppap/tasks',
  PPAP_TASKS: '/ppap/ppapTasks',
  PPAP: '/ppap/ppap',
  SUGGESTED_DOCUMENTS: '/ppap/suggestedDocuments',
  STAGE_DOCUMENTS: '/ppap/ppapStageDocuments',
  PART_CATEGORIES: '/ppap/partCategories',
  PPAP_SUBMISSIONLEVELS: '/ppap/ppapSubmissionLevels',
  PPAP_REASONS: '/ppap/ppapReasons',
  ALL_DOCUMENTS: '/ppap/documents',
  APQP_TIMING_CHART_ACTIVITY_GROUP: '/ppap/apqpTimingChartActivityGroups',
  PPAP_STAGES: '/ppap/ppapStages',
  PPAP_STAGE_DOCUMENT: '/ppap/ppapStageDocuments',
  AUTH_ALLOWED_RESOURCE: 'authorization/allowed-resources',
  PPAP_STATUS:'/ppap/ppapStatus',
  getSupplierId: (supplierCode) => `/ppap/supplier/${supplierCode}`,
  getSupplierListOfPpap: (supplierId) => `/ppap/supplier/${supplierId}/ppap`,
  getAllBusinessUnits: () => 'ppap/businessUnits',
  getAllPlantsForBusinessUnit: () => 'ppap/plants',
  getAllVehicleLines: () => 'ppap/vehicleLines',
  getAllProjectMilestones: () => 'ppap/projectMilestones',
  getAllPlants: () => 'ppap/purchaseOrderCriteria/plants',
  getAllParts: () => 'ppap/purchaseOrderCriteria/parts',
  getAqCommodity: () => 'ppap/aqCommodityGroups',
  getPurchaseCommodity: () => 'ppap/commodityGroups',
  getSuppliers: () => 'ppap/purchaseOrderCriteria/suppliers',
  getPpapStageDocumentDownload: (id) => `/ppap/ppapStageDocuments/${id}/template/download`,
  getProject: (id) => `ppap/projects/${id}`,
  getPpap: (id) => `/ppap/ppap/${id}`,
  getPresignedUrl: (id) => `ppap/documents/${id}/template/upload`,
  getKamDetails: (supplierCode) => `/ppap/supplier/${supplierCode}/kamDetails`
}; 

export const DATE_FORMAT = {
  ISO: 'YYYY-MM-DD',
  DD_MM_YYYY: 'DD-MM-YYYY',
};

export const APPLICATION_NAME = 'Template Application';

export const TOOLS = {
  MASTER_DATA_MANAGEMENT: 'Supply Chain Master Data',
  ASN_OVERVIEW: 'Asn Overview',
};

export const USER_STATUS = {
  SQ_ENGINEER: 'sq-engineer',
  SUPPLIER: 'vendor-quality'
};

export const USER_OPERATIONS = {
  CREATE_PPAP: "create-ppap",
  TERMINATE_PPAP: "terminate-ppap",
  INITIATE_PPAP: "initiate-ppap",
  CREATE_PROJECT: "create-project",
  CREATE_PPAP_STAGE_DOCUMENT: "create-ppap-stage-document",
  LIST_PROJECTS: "list-projects",
  LIST_AQ_COMMODITY_GROUPS: "list-aq-commodity-groups",
  LIST_BUSINESS_UNITS: "list-business-units",
  LIST_PLANTS: "list-plants",
  LIST_PROJECT_MILESTONES: "list-project-milestones",
  LIST_PURCHASE_ORDERS: "list-purchase-orders",
  LIST_PURCHASE_ORDER_CRITERIA: "list-purchase-order-criteria",
  LIST_VEHICLE_LINES: "list-vehicle-lines",
  LIST_PART_CATEGORIES: "list-part-categories",
  LIST_PPAP_SUBMISSION_LEVELS: "list-ppap-submission-levels",
  LIST_PPAP_REASONS: "list-ppap-reasons",
  LIST_DOCUMENTS: "list-documents",
  LIST_PPAP_STAGES: "list-ppap-stages",
  LIST_SUGGESTED_DOCUMENTS: "list-suggested-documents"
}

export const RESOURCE_TYPE = {
  PPAP: 'ppap',
  PROJECT: 'project',
  AQ_COMMODITY_GROUP: 'aq-commodity-group',
  BUSINESS_UNIT: 'business-unit',
  PLANT: 'plant',
  PROJECT_MILESTONE: 'project-milestone',
  PURCHASE_ORDER: 'purchase-order',
  PURCHASE_ORDER_CRITERIA: 'purchase-order-criteria',
  VEHICLE_LINE: 'vehicle-line',
  PART_CATEGORY: 'part-category',
  PPAP_SUBMISSION_LEVEL: 'ppap-submission-level',
  PPAP_REASON: 'ppap-reason',
  PPAP_STAGE_DOCUMENT: 'ppap-stage-document'
}

export const HATEAOS_LINKS = {
  PPAP: 'ppap'
}

export const Regex = {
  email: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  name: /^[a-zA-Z ]+$/,
  phone: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/
}

export const EDIT_STATUS = {
  DRAFT: 'DRAFT',
  COMPLETE: 'COMPLETE'
}

export const PPAP_STATE = {
  INITIATE: 'INITIATE',
  APQP: 'APQP',
  PIST: 'PIST',
  PIPC: 'PIPC',
  RUN_AT_RATE: 'RUN_AT_RATE',
  PSW: 'PSW',
  COMPLETE: 'COMPLETE',
  TERMINATE: 'TERMINATE'
}

export const stateStringMap = {
  [PPAP_STATE.INITIATE]: 'INITIATE',
  [PPAP_STATE.APQP]: 'APQP',
  [PPAP_STATE.PIST]: 'PIST',
  [PPAP_STATE.PIPC]: 'PIPC',
  [PPAP_STATE.RUN_AT_RATE]: 'Run at rate',
  [PPAP_STATE.PSW]: 'PSW',
  [PPAP_STATE.COMPLETE]: 'COMPLETE',
  [PPAP_STATE.TERMINATE]: 'TERMINATE'
};

export const PPAP_COMPLETE_STATE = ['PIST', 'PIPC', 'RUN_AT_RATE', 'PSW']

export const PPAP_APP_NAME = 'ppap';

export const PPAP_APP_RESOURCES = {
  'org:tml:application:avantgarde-home:esakha:ppap': PPAP_APP_NAME,
};

export const PROJECT_TYPE = {
  EDIT: 'edit',
  CREATE: 'create'
};

export const INACTIVITY_EXCEPTION_URLS={
  AUTH_BULK_RESOURCE: 'authorization/bulk-allowed-resources',
  AUTH_ALLOWED_RESOURCE: 'authorization/allowed-resources',
}