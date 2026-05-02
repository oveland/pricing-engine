package com.pricing.unit.domain.model;

import static org.junit.jupiter.api.Assertions.*;

import com.pricing.domain.model.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PriceTest {
    private static final BrandId BRAND_ZARA = new BrandId(1L);
    private static final ProductId PRODUCT_35455 = new ProductId(35455L);
    private static final LocalDateTime JUN_14_START = LocalDateTime.of(2020, 6, 14, 0, 0, 0);
    private static final LocalDateTime DEC_31_END = LocalDateTime.of(2020, 12, 31, 23, 59, 59);
    private static final DateRange FULL_RANGE = new DateRange(JUN_14_START, DEC_31_END);
    private static final Money PRICE_35_50_EUR = new Money(new BigDecimal("35.50"), "EUR");

    @Test
    @DisplayName("should create Price preserving all Value Objects")
    void shouldCreatePricePreservingAllValueObjects() {
        Price price = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);

        assertEquals(BRAND_ZARA, price.getBrandId());
        assertEquals(PRODUCT_35455, price.getProductId());
        assertEquals(1, price.getPriceList());
        assertEquals(FULL_RANGE, price.getDateRange());
        assertEquals(0, price.getPriority());
        assertEquals(PRICE_35_50_EUR, price.getMoney());
    }

    @Test
    @DisplayName("should create Price with different priority and money values")
    void shouldCreatePriceWithDifferentValues() {
        DateRange shortRange =
                new DateRange(LocalDateTime.of(2020, 6, 14, 15, 0, 0), LocalDateTime.of(2020, 6, 14, 18, 30, 0));
        Money otherPrice = new Money(new BigDecimal("25.45"), "EUR");

        Price price = new Price(BRAND_ZARA, PRODUCT_35455, 2, shortRange, 1, otherPrice);

        assertEquals(2, price.getPriceList());
        assertEquals(shortRange, price.getDateRange());
        assertEquals(1, price.getPriority());
        assertEquals(otherPrice, price.getMoney());
    }

    @Test
    @DisplayName("should return true when date is inside the price date range")
    void shouldReturnTrueWhenDateIsInsideRange() {
        Price price = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        LocalDateTime insideDate = LocalDateTime.of(2020, 8, 15, 12, 0, 0);

        assertTrue(price.isApplicableAt(insideDate));
    }

    @Test
    @DisplayName("should return true when date equals start of range")
    void shouldReturnTrueWhenDateEqualsStartOfRange() {
        Price price = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);

        assertTrue(price.isApplicableAt(JUN_14_START));
    }

    @Test
    @DisplayName("should return true when date equals end of range")
    void shouldReturnTrueWhenDateEqualsEndOfRange() {
        Price price = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);

        assertTrue(price.isApplicableAt(DEC_31_END));
    }

    @Test
    @DisplayName("should return false when date is before the price date range")
    void shouldReturnFalseWhenDateIsBeforeRange() {
        Price price = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        LocalDateTime beforeDate = LocalDateTime.of(2020, 6, 13, 23, 59, 59);

        assertFalse(price.isApplicableAt(beforeDate));
    }

    @Test
    @DisplayName("should return false when date is after the price date range")
    void shouldReturnFalseWhenDateIsAfterRange() {
        Price price = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        LocalDateTime afterDate = LocalDateTime.of(2021, 1, 1, 0, 0, 0);

        assertFalse(price.isApplicableAt(afterDate));
    }

    @Test
    @DisplayName("should return true when this price has higher priority than other")
    void shouldReturnTrueWhenHigherPriority() {
        Price highPriority = new Price(BRAND_ZARA, PRODUCT_35455, 2, FULL_RANGE, 1, PRICE_35_50_EUR);
        Price lowPriority = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);

        assertTrue(highPriority.hasHigherPriorityThan(lowPriority));
    }

    @Test
    @DisplayName("should return false when this price has lower priority than other")
    void shouldReturnFalseWhenLowerPriority() {
        Price lowPriority = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        Price highPriority = new Price(BRAND_ZARA, PRODUCT_35455, 2, FULL_RANGE, 1, PRICE_35_50_EUR);

        assertFalse(lowPriority.hasHigherPriorityThan(highPriority));
    }

    @Test
    @DisplayName("should return false when both prices have equal priority")
    void shouldReturnFalseWhenEqualPriority() {
        Price price1 = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 1, PRICE_35_50_EUR);
        Price price2 = new Price(BRAND_ZARA, PRODUCT_35455, 3, FULL_RANGE, 1, PRICE_35_50_EUR);

        assertFalse(price1.hasHigherPriorityThan(price2));
    }

    @Test
    @DisplayName("should return price with highest priority from multiple prices")
    void shouldReturnPriceWithHighestPriorityFromMultiplePrices() {
        Price lowPriority = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        Money price25 = new Money(new BigDecimal("25.45"), "EUR");
        Price highPriority = new Price(BRAND_ZARA, PRODUCT_35455, 2, FULL_RANGE, 1, price25);
        Money price30 = new Money(new BigDecimal("30.50"), "EUR");
        Price mediumPriority = new Price(BRAND_ZARA, PRODUCT_35455, 3, FULL_RANGE, 1, price30);

        Optional<Price> result = Price.withHighestPriority(List.of(lowPriority, highPriority, mediumPriority));

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getPriority());
    }

    @Test
    @DisplayName("should return the single price when list has one element")
    void shouldReturnSinglePriceWhenListHasOneElement() {
        Price onlyPrice = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);

        Optional<Price> result = Price.withHighestPriority(List.of(onlyPrice));

        assertTrue(result.isPresent());
        assertEquals(onlyPrice, result.get());
    }

    @Test
    @DisplayName("should return empty Optional when list is empty")
    void shouldReturnEmptyOptionalWhenListIsEmpty() {
        Optional<Price> result = Price.withHighestPriority(Collections.emptyList());

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("should return price with highest priority value among distinct priorities")
    void shouldReturnPriceWithHighestPriorityAmongDistinctPriorities() {
        Price priority0 = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        Money price25 = new Money(new BigDecimal("25.45"), "EUR");
        Price priority5 = new Price(BRAND_ZARA, PRODUCT_35455, 2, FULL_RANGE, 5, price25);
        Money price30 = new Money(new BigDecimal("30.50"), "EUR");
        Price priority3 = new Price(BRAND_ZARA, PRODUCT_35455, 3, FULL_RANGE, 3, price30);

        Optional<Price> result = Price.withHighestPriority(List.of(priority0, priority5, priority3));

        assertTrue(result.isPresent());
        assertEquals(5, result.get().getPriority());
        assertEquals(price25, result.get().getMoney());
    }
}
