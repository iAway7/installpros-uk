/**
 * Which sector card the visitor clicked on the way to the form.
 *
 * The team knows the postcode and the install type today, but not what made
 * somebody put their hand up. A lead that says "came from the Farms card" is a
 * different call from one that says nothing, and across a few weeks it also
 * says which of the six sectors is worth advertising.
 *
 * sessionStorage rather than a React context or a query string: the two forms
 * live in different components on the page, a query string would follow people
 * into shared links and skew the data, and this should not survive the tab.
 * Every access is wrapped because private mode and blocked storage throw
 * rather than returning null.
 */
const KEY = "ipxSectorInterest";

export function rememberSectorInterest(sector: string): void {
  try {
    sessionStorage.setItem(KEY, sector);
  } catch {
    /* storage blocked; the lead simply arrives without the sector */
  }
}

export function readSectorInterest(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}
