package edu.up.cas.sp.util;

import java.util.Comparator;
import java.util.Map;

/*
 * Sorts by Descending order
 */
public class MyDoubleComparator implements Comparator<Object> {

    Map<String, Double> theMapToSort;

    public MyDoubleComparator(Map<String, Double> theMapToSort) {
        this.theMapToSort = theMapToSort;
    }

    public int compare(Object key1, Object key2) {
        Double val1 = (Double) theMapToSort.get(key1);
        Double val2 = (Double) theMapToSort.get(key2);
        if (val1 < val2) {
            return 1;
        } else {
            return -1;
        }
    }
}

