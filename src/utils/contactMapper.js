export function mapPickedContact(contact){ return {name:contact?.name?.[0]||'',mobile:contact?.tel?.[0]||''} }
