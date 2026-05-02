package com.pricing.unit.domain.model;

import static org.junit.jupiter.api.Assertions.*;

import com.pricing.domain.model.DateRange;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DateRangeTest {
    private static final LocalDateTime JUN_14_START = LocalDateTime.of(2020, 6, 14, 0, 0, 0);
    private static final LocalDateTime DEC_31_END = LocalDateTime.of(2020, 12, 31, 23, 59, 59);

    @Test
    @DisplayName("should create DateRange with valid start and end dates")
    void shouldCreateDateRangeWithValidDates() {
        DateRange dateRange = new DateRange(JUN_14_START, DEC_31_END);

        assertEquals(JUN_14_START, dateRange.startDate());
        assertEquals(DEC_31_END, dateRange.endDate());
    }

    @Test
    @DisplayName("should create DateRange when start equals end (single instant)")
    void shouldCreateDateRangeWhenStartEqualsEnd() {
        LocalDateTime sameDate = LocalDateTime.of(2020, 6, 14, 10, 0, 0);
        DateRange dateRange = new DateRange(sameDate, sameDate);

        assertEquals(sameDate, dateRange.startDate());
        assertEquals(sameDate, dateRange.endDate());
    }

    @Test
    @DisplayName("should throw NullPointerException when startDate is null")
    void shouldThrowNullPointerExceptionWhenStartDateIsNull() {
        assertThrows(NullPointerException.class, () -> new DateRange(null, DEC_31_END));
    }

    @Test
    @DisplayName("should throw NullPointerException when endDate is null")
    void shouldThrowNullPointerExceptionWhenEndDateIsNull() {
        assertThrows(NullPointerException.class, () -> new DateRange(JUN_14_START, null));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when startDate is after endDate")
    void shouldThrowIllegalArgumentExceptionWhenStartAfterEnd() {
        assertThrows(IllegalArgumentException.class, () -> new DateRange(DEC_31_END, JUN_14_START));
    }

    @Test
    @DisplayName("should return true when date is inside the range")
    void shouldReturnTrueWhenDateIsInsideRange() {
        DateRange dateRange = new DateRange(JUN_14_START, DEC_31_END);
        LocalDateTime insideDate = LocalDateTime.of(2020, 8, 15, 12, 0, 0);

        assertTrue(dateRange.contains(insideDate));
    }

    @Test
    @DisplayName("should return true when date equals startDate (lower boundary)")
    void shouldReturnTrueWhenDateEqualsStartDate() {
        DateRange dateRange = new DateRange(JUN_14_START, DEC_31_END);

        assertTrue(dateRange.contains(JUN_14_START));
    }

    @Test
    @DisplayName("should return true when date equals endDate (upper boundary)")
    void shouldReturnTrueWhenDateEqualsEndDate() {
        DateRange dateRange = new DateRange(JUN_14_START, DEC_31_END);

        assertTrue(dateRange.contains(DEC_31_END));
    }

    @Test
    @DisplayName("should return true when start equals end and date matches (single instant)")
    void shouldReturnTrueWhenSingleInstantAndDateMatches() {
        LocalDateTime instant = LocalDateTime.of(2020, 6, 14, 10, 0, 0);
        DateRange dateRange = new DateRange(instant, instant);

        assertTrue(dateRange.contains(instant));
    }

    @Test
    @DisplayName("should return false when date is before startDate")
    void shouldReturnFalseWhenDateIsBeforeStartDate() {
        DateRange dateRange = new DateRange(JUN_14_START, DEC_31_END);
        LocalDateTime beforeDate = LocalDateTime.of(2020, 6, 13, 23, 59, 59);

        assertFalse(dateRange.contains(beforeDate));
    }

    @Test
    @DisplayName("should return false when date is after endDate")
    void shouldReturnFalseWhenDateIsAfterEndDate() {
        DateRange dateRange = new DateRange(JUN_14_START, DEC_31_END);
        LocalDateTime afterDate = LocalDateTime.of(2021, 1, 1, 0, 0, 0);

        assertFalse(dateRange.contains(afterDate));
    }

    @Test
    @DisplayName("should be equal when two DateRanges have the same start and end dates")
    void shouldBeEqualWhenSameDates() {
        DateRange dateRange1 = new DateRange(JUN_14_START, DEC_31_END);
        DateRange dateRange2 = new DateRange(JUN_14_START, DEC_31_END);

        assertEquals(dateRange1, dateRange2);
        assertEquals(dateRange1.hashCode(), dateRange2.hashCode());
    }

    @Test
    @DisplayName("should not be equal when DateRanges have different dates")
    void shouldNotBeEqualWhenDifferentDates() {
        DateRange dateRange1 = new DateRange(JUN_14_START, DEC_31_END);
        LocalDateTime otherEnd = LocalDateTime.of(2020, 7, 1, 0, 0, 0);
        DateRange dateRange2 = new DateRange(JUN_14_START, otherEnd);

        assertNotEquals(dateRange1, dateRange2);
    }
}
