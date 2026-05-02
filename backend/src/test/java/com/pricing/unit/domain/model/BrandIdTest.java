package com.pricing.unit.domain.model;

import static org.junit.jupiter.api.Assertions.*;

import com.pricing.domain.model.BrandId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class BrandIdTest {
    @Test
    @DisplayName("should create BrandId with valid positive value")
    void shouldCreateBrandIdWithValidPositiveValue() {
        BrandId brandId = new BrandId(1L);

        assertEquals(1L, brandId.value());
    }

    @Test
    @DisplayName("should preserve large positive value")
    void shouldPreserveLargePositiveValue() {
        BrandId brandId = new BrandId(999_999L);

        assertEquals(999_999L, brandId.value());
    }

    @Test
    @DisplayName("should throw NullPointerException when value is null")
    void shouldThrowNullPointerExceptionWhenValueIsNull() {
        assertThrows(NullPointerException.class, () -> new BrandId(null));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when value is zero")
    void shouldThrowIllegalArgumentExceptionWhenValueIsZero() {
        assertThrows(IllegalArgumentException.class, () -> new BrandId(0L));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when value is negative")
    void shouldThrowIllegalArgumentExceptionWhenValueIsNegative() {
        assertThrows(IllegalArgumentException.class, () -> new BrandId(-1L));
    }

    @Test
    @DisplayName("should be equal when two BrandIds have the same value")
    void shouldBeEqualWhenSameValue() {
        BrandId brandId1 = new BrandId(1L);
        BrandId brandId2 = new BrandId(1L);

        assertEquals(brandId1, brandId2);
        assertEquals(brandId1.hashCode(), brandId2.hashCode());
    }

    @Test
    @DisplayName("should not be equal when two BrandIds have different values")
    void shouldNotBeEqualWhenDifferentValues() {
        BrandId brandId1 = new BrandId(1L);
        BrandId brandId2 = new BrandId(2L);

        assertNotEquals(brandId1, brandId2);
    }
}
