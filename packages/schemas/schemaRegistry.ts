// packages/schemas/schemaRegistry.ts
// Unified schema registry for glyphd. Lightweight, extensible.

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray
export interface JSONObject { [k: string]: JSONValue }
export interface JSONArray extends Array<JSONValue> {}

export type SchemaKey =
  | 'Product' | 'Offer' | 'ProductGroup'
  | 'Service' | 'LocalBusiness' | 'Organization' | 'Event'
  | 'CreativeWork' | 'ImageObject' | 'VideoObject' | 'HowTo' | 'Recipe'
  | 'Person' | 'Place' | 'Building'
  | 'Review' | 'AggregateRating'
  | 'Project' | 'Conversation' | 'Message' | 'Task' | 'LearningResource' | 'DigitalDocument'
  | 'Dataset' | 'Movie' | 'MusicRecording'

export interface SchemaDescriptor {
  key: SchemaKey
  required: string[]
  recommended?: string[]
  componentHints?: string[] // glyphd UI components to consider
  jsonld: (data: JSONObject) => JSONObject
}

// Helpers
const ctx = 'https://schema.org'

function thing(type: string, rest: JSONObject): JSONObject {
  return { '@context': ctx, '@type': type, ...rest }
}

export const Registry: Record<SchemaKey, SchemaDescriptor> = {
  Product: {
    key: 'Product',
    required: ['name'],
    recommended: ['description','brand','sku','image','gtin12','gtin13','mpn','color','size','material','itemCondition'],
    componentHints: ['ProductCard','Gallery','Specs','BuyBox'],
    jsonld: (d) => thing('Product', d)
  },
  Offer: {
    key: 'Offer',
    required: ['price','priceCurrency','availability'],
    recommended: ['shippingDetails','hasMerchantReturnPolicy','itemCondition','url','seller'],
    componentHints: ['BuyBox','PriceTag','ShippingReturns'],
    jsonld: (d) => thing('Offer', d)
  },
  ProductGroup: {
    key: 'ProductGroup',
    required: ['name','variesBy','hasVariant'],
    recommended: ['brand','category'],
    componentHints: ['VariantPicker','Gallery','Specs'],
    jsonld: (d) => thing('ProductGroup', d)
  },
  Service: {
    key: 'Service',
    required: ['serviceType','name'],
    recommended: ['areaServed','provider','offers','description'],
    componentHints: ['ServicesList','QuoteCTA','CoverageMap'],
    jsonld: (d) => thing('Service', d)
  },
  LocalBusiness: {
    key: 'LocalBusiness',
    required: ['name','address'],
    recommended: ['openingHours','telephone','geo','sameAs','areaServed'],
    componentHints: ['MapCard','Hours','ContactCard'],
    jsonld: (d) => thing('LocalBusiness', d)
  },
  Organization: {
    key: 'Organization',
    required: ['name'],
    recommended: ['logo','url','sameAs','contactPoint','memberOf','founder','foundingDate'],
    componentHints: ['About','PartnerLogos','Contacts'],
    jsonld: (d) => thing('Organization', d)
  },
  Event: {
    key: 'Event',
    required: ['name','startDate'],
    recommended: ['endDate','eventStatus','eventAttendanceMode','location','performer','organizer','offers'],
    componentHints: ['EventHero','Schedule','TicketCTA'],
    jsonld: (d) => thing('Event', d)
  },
  CreativeWork: {
    key: 'CreativeWork',
    required: ['name'],
    recommended: ['creator','genre','artform','artMedium','isPartOf','about','image','dateCreated','review'],
    componentHints: ['CaseStudy','Gallery','Credits'],
    jsonld: (d) => thing('CreativeWork', d)
  },
  ImageObject: {
    key: 'ImageObject',
    required: ['contentUrl'],
    recommended: ['caption','encodingFormat','author'],
    componentHints: ['Gallery','Lightbox'],
    jsonld: (d) => thing('ImageObject', d)
  },
  VideoObject: {
    key: 'VideoObject',
    required: ['name','thumbnailUrl','uploadDate'],
    recommended: ['description','duration','embedUrl','contentUrl'],
    componentHints: ['VideoPlayer','Chapters'],
    jsonld: (d) => thing('VideoObject', d)
  },
  HowTo: {
    key: 'HowTo',
    required: ['name','step'],
    recommended: ['supply','tool','totalTime','estimatedCost','image'],
    componentHints: ['Steps','Materials','EstimatedTime'],
    jsonld: (d) => thing('HowTo', d)
  },
  Recipe: {
    key: 'Recipe',
    required: ['name','recipeIngredient','recipeInstructions'],
    recommended: ['cookTime','totalTime','recipeYield','image','nutrition'],
    componentHints: ['RecipeCard','Ingredients','Steps'],
    jsonld: (d) => thing('Recipe', d)
  },
  Person: {
    key: 'Person',
    required: ['name'],
    recommended: ['image','sameAs','jobTitle','affiliation'],
    componentHints: ['AuthorCard','TeamGrid'],
    jsonld: (d) => thing('Person', d)
  },
  Place: {
    key: 'Place',
    required: ['name','address'],
    recommended: ['geo','image'],
    componentHints: ['MapCard','Hero'],
    jsonld: (d) => thing('Place', d)
  },
  Building: {
    key: 'Building',
    required: ['name','address'],
    recommended: ['floorSize','image','architect'],
    componentHints: ['ProjectStats','Gallery'],
    jsonld: (d) => thing('Building', d)
  },
  Review: {
    key: 'Review',
    required: ['reviewRating','author'],
    recommended: ['reviewBody','itemReviewed','datePublished'],
    componentHints: ['Testimonial','Stars'],
    jsonld: (d) => thing('Review', d)
  },
  AggregateRating: {
    key: 'AggregateRating',
    required: ['ratingValue','reviewCount'],
    recommended: [],
    componentHints: ['Stars','Badge'],
    jsonld: (d) => thing('AggregateRating', d)
  },
  Project: {
    key: 'Project',
    required: ['name'],
    recommended: ['description','contributor','about','image','dateCreated'],
    componentHints: ['CaseStudy','Timeline'],
    jsonld: (d) => thing('CreativeWork', { ...d, additionalType: 'Project' })
  },
  Conversation: {
    key: 'Conversation',
    required: ['name','hasPart'],
    recommended: ['participant','about'],
    componentHints: ['ChatLog'],
    jsonld: (d) => thing('Conversation', d)
  },
  Message: {
    key: 'Message',
    required: ['text','dateSent','sender'],
    recommended: ['recipient'],
    componentHints: ['ChatBubble'],
    jsonld: (d) => thing('Message', d)
  },
  Task: {
    key: 'Task',
    required: ['name','status'],
    recommended: ['dueDate','priority'],
    componentHints: ['TaskList'],
    jsonld: (d) => thing('Action', { ...d, additionalType: 'Task' })
  },
  LearningResource: {
    key: 'LearningResource',
    required: ['name'],
    recommended: ['educationalLevel','learningResourceType','about','author'],
    componentHints: ['LessonCard'],
    jsonld: (d) => thing('LearningResource', d)
  },
  DigitalDocument: {
    key: 'DigitalDocument',
    required: ['name','fileFormat'],
    recommended: ['author','dateCreated','url'],
    componentHints: ['DocViewer'],
    jsonld: (d) => thing('DigitalDocument', d)
  },
  Dataset: {
    key: 'Dataset',
    required: ['name'],
    recommended: ['creator','distribution','variableMeasured','license'],
    componentHints: ['DataCard'],
    jsonld: (d) => thing('Dataset', d)
  },
  Movie: {
    key: 'Movie',
    required: ['name'],
    recommended: ['director','actor','duration','genre','datePublished','thumbnailUrl','trailer'],
    componentHints: ['VideoHero','Credits'],
    jsonld: (d) => thing('Movie', d)
  },
  MusicRecording: {
    key: 'MusicRecording',
    required: ['name','byArtist'],
    recommended: ['duration','inAlbum','genre','datePublished'],
    componentHints: ['Player','Credits'],
    jsonld: (d) => thing('MusicRecording', d)
  }
}
