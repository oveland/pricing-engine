package com.pricing.unit.domain.model;

import static org.junit.jupiter.api.Assertions.*;

import com.pricing.domain.model.ProductId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ProductIdTest {
    @Test
    @DisplayName("should create ProductId with valid positive value")
    void shouldCreateProductIdWithValidPositiveValue() {
        ProductId productId = new ProductId(35455L);

        assertEquals(35455L, productId.value());
    }

    @Test
    @DisplayName("should preserve large positive value")
    void shouldPreserveLargePositiveValue() {
        ProductId productId = new ProductId(Long.MAX_VALUE);

        assertEquals(Long.MAX_VALUE, productId.value());
    }

    @Test
    @DisplayName("should throw NullPointerException when value is null")
    void shouldThrowNullPointerExceptionWhenValueIsNull() {
        assertThrows(NullPointerException.class, () -> new ProductId(null));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when value is zero")
    void shouldThrowIllegalArgumentExceptionWhenValueIsZero() {
        assertThrows(IllegalArgumentException.class, () -> new ProductId(0L));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when value is negative")
    void shouldThrowIllegalArgumentExceptionWhenValueIsNegative() {
        assertThrows(IllegalArgumentException.class, () -> new ProductId(-5L));
    }

    @Test
    @DisplayName("should be equal when two ProductIds have the same value")
    void shouldBeEqualWhenSameValue() {
        ProductId productId1 = new ProductId(35455L);
        ProductId productId2 = new ProductId(35455L);

        assertEquals(productId1, productId2);
        assertEquals(productId1.hashCode(), productId2.hashCode());
    }

    @Test
    @DisplayName("should not be equal when two ProductIds have different values")
    void shouldNotBeEqualWhenDifferentValues() {
        ProductId productId1 = new ProductId(35455L);
        ProductId productId2 = new ProductId(99999L);

        assertNotEquals(productId1, productId2);
    }
}
