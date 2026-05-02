package com.pricing.unit.domain.model;

import com.pricing.domain.model.Money;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class MoneyTest {
    @Test
    @DisplayName("should create Money with valid amount and currency")
    void shouldCreateMoneyWithValidAmountAndCurrency() {
        Money money = new Money(new BigDecimal("35.50"), "EUR");

        assertEquals(new BigDecimal("35.50"), money.amount());
        assertEquals("EUR", money.currency());
    }

    @Test
    @DisplayName("should create Money with zero amount")
    void shouldCreateMoneyWithZeroAmount() {
        Money money = new Money(BigDecimal.ZERO, "USD");

        assertEquals(BigDecimal.ZERO, money.amount());
        assertEquals("USD", money.currency());
    }

    @Test
    @DisplayName("should throw NullPointerException when amount is null")
    void shouldThrowNullPointerExceptionWhenAmountIsNull() {
        assertThrows(NullPointerException.class, () -> new Money(null, "EUR"));
    }

    @Test
    @DisplayName("should throw NullPointerException when currency is null")
    void shouldThrowNullPointerExceptionWhenCurrencyIsNull() {
        BigDecimal validAmount = new BigDecimal("10.00");
        assertThrows(NullPointerException.class, () -> new Money(validAmount, null));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when amount is negative")
    void shouldThrowIllegalArgumentExceptionWhenAmountIsNegative() {
        BigDecimal negativeAmount = new BigDecimal("-1.00");
        assertThrows(IllegalArgumentException.class,
                () -> new Money(negativeAmount, "EUR"));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when currency has less than 3 characters")
    void shouldThrowIllegalArgumentExceptionWhenCurrencyTooShort() {
        BigDecimal validAmount = new BigDecimal("10.00");
        assertThrows(IllegalArgumentException.class,
                () -> new Money(validAmount, "EU"));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when currency has more than 3 characters")
    void shouldThrowIllegalArgumentExceptionWhenCurrencyTooLong() {
        BigDecimal validAmount = new BigDecimal("10.00");
        assertThrows(IllegalArgumentException.class,
                () -> new Money(validAmount, "EURO"));
    }

    @Test
    @DisplayName("should throw IllegalArgumentException when currency is empty")
    void shouldThrowIllegalArgumentExceptionWhenCurrencyIsEmpty() {
        BigDecimal validAmount = new BigDecimal("10.00");
        assertThrows(IllegalArgumentException.class,
                () -> new Money(validAmount, ""));
    }

    @Test
    @DisplayName("should be equal when two Money objects have same amount and currency")
    void shouldBeEqualWhenSameAmountAndCurrency() {
        Money money1 = new Money(new BigDecimal("35.50"), "EUR");
        Money money2 = new Money(new BigDecimal("35.50"), "EUR");

        assertEquals(money1, money2);
        assertEquals(money1.hashCode(), money2.hashCode());
    }

    @Test
    @DisplayName("should not be equal when amounts differ")
    void shouldNotBeEqualWhenAmountsDiffer() {
        Money money1 = new Money(new BigDecimal("35.50"), "EUR");
        Money money2 = new Money(new BigDecimal("25.45"), "EUR");

        assertNotEquals(money1, money2);
    }

    @Test
    @DisplayName("should not be equal when currencies differ")
    void shouldNotBeEqualWhenCurrenciesDiffer() {
        Money money1 = new Money(new BigDecimal("35.50"), "EUR");
        Money money2 = new Money(new BigDecimal("35.50"), "USD");

        assertNotEquals(money1, money2);
    }
}
