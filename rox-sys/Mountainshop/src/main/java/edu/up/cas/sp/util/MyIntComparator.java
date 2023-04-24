package edu.up.cas.sp.util;

import java.util.Comparator;
import java.util.Map;

/*
 * Sorts by Descending order
 */
public class MyIntComparator implements Comparator<Object> {

    Map<String, Integer> theMapToSort;

    public MyIntComparator(Map<String, Integer> theMapToSort) {
        this.theMapToSort = theMapToSort;
    }

    public int compare(Object key1, Object key2) {
        Integer val1 = (Integer) theMapToSort.get(key1);
        Integer val2 = (Integer) theMapToSort.get(key2);
        if (val1 < val2) {
            return 1;
        } else {
            return -1;
        }
    }
}
