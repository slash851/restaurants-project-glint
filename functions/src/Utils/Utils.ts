/**
 * General utils class
 */
export class DbUtils{
    /**
     * adding WHERE or AND to query
     * @param query
     * @private
     */
    static addWhereOrAndToQuery(query: string): string {
        return query.indexOf('WHERE') === -1 ? ' WHERE ' : ' AND ';
    }
}
