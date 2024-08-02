

class MonthConverterHelper {
    public transformMonth(index_bulan: number): any {
        if (index_bulan >= 6) {
            return index_bulan - 6
        } else {
            return index_bulan + 6
        }
    }

}

export default new MonthConverterHelper;