package com.pricing.unit.application;

import com.pricing.application.usecase.FindApplicablePriceUseCaseImpl;
import com.pricing.domain.exception.PriceNotFoundException;
import com.pricing.domain.model.*;
import com.pricing.domain.port.output.PriceRepositoryPort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FindApplicablePriceUseCaseImplTest {
    @Mock
    private PriceRepositoryPort priceRepository;

    @InjectMocks
    private FindApplicablePriceUseCaseImpl useCase;

    private static final BrandId BRAND_ZARA = new BrandId(1L);
    private static final ProductId PRODUCT_35455 = new ProductId(35455L);
    private static final LocalDateTime APPLICATION_DATE = LocalDateTime.of(2020, 6, 14, 10, 0, 0);

    private static final DateRange FULL_RANGE = new DateRange(
            LocalDateTime.of(2020, 6, 14, 0, 0, 0),
            LocalDateTime.of(2020, 12, 31, 23, 59, 59));

    private static final DateRange SHORT_RANGE = new DateRange(
            LocalDateTime.of(2020, 6, 14, 15, 0, 0),
            LocalDateTime.of(2020, 6, 14, 18, 30, 0));

    private static final Money PRICE_35_50_EUR = new Money(new BigDecimal("35.50"), "EUR");
    private static final Money PRICE_25_45_EUR = new Money(new BigDecimal("25.45"), "EUR");
    private static final Money PRICE_38_95_EUR = new Money(new BigDecimal("38.95"), "EUR");

    @Test
    @DisplayName("should return the correct price when repository returns a single candidate")
    void shouldReturnCorrectPriceWhenSingleCandidate() {
        Price singlePrice = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        when(priceRepository.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(List.of(singlePrice));

        Price result = useCase.findApplicablePrice(APPLICATION_DATE, PRODUCT_35455, BRAND_ZARA);

        assertSame(singlePrice, result);
        verify(priceRepository).findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE);
    }

    @Test
    @DisplayName("should return the price with highest priority when repository returns multiple candidates")
    void shouldReturnHighestPriorityPriceWhenMultipleCandidates() {
        Price lowPriority = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        Price highPriority = new Price(BRAND_ZARA, PRODUCT_35455, 2, SHORT_RANGE, 1, PRICE_25_45_EUR);
        when(priceRepository.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(List.of(lowPriority, highPriority));

        Price result = useCase.findApplicablePrice(APPLICATION_DATE, PRODUCT_35455, BRAND_ZARA);

        assertEquals(1, result.getPriority());
        assertEquals(PRICE_25_45_EUR, result.getMoney());
        assertEquals(2, result.getPriceList());
    }

    @Test
    @DisplayName("should return the price with highest priority among three candidates with distinct priorities")
    void shouldReturnHighestPriorityAmongThreeCandidates() {
        Price priority0 = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        Price priority1 = new Price(BRAND_ZARA, PRODUCT_35455, 2, SHORT_RANGE, 1, PRICE_25_45_EUR);
        DateRange anotherRange = new DateRange(
                LocalDateTime.of(2020, 6, 15, 16, 0, 0),
                LocalDateTime.of(2020, 12, 31, 23, 59, 59));
        Price priority2 = new Price(BRAND_ZARA, PRODUCT_35455, 4, anotherRange, 2, PRICE_38_95_EUR);
        when(priceRepository.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(List.of(priority0, priority1, priority2));

        Price result = useCase.findApplicablePrice(APPLICATION_DATE, PRODUCT_35455, BRAND_ZARA);

        assertEquals(2, result.getPriority());
        assertEquals(PRICE_38_95_EUR, result.getMoney());
        assertEquals(4, result.getPriceList());
    }

    @Test
    @DisplayName("should throw PriceNotFoundException when repository returns empty list")
    void shouldThrowPriceNotFoundExceptionWhenNoCandidates() {
        when(priceRepository.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(Collections.emptyList());

        PriceNotFoundException exception = assertThrows(
                PriceNotFoundException.class,
                () -> useCase.findApplicablePrice(APPLICATION_DATE, PRODUCT_35455, BRAND_ZARA));

        assertTrue(exception.getMessage().contains("brandId=1"));
        assertTrue(exception.getMessage().contains("productId=35455"));
        assertTrue(exception.getMessage().contains(APPLICATION_DATE.toString()));
    }

    @Test
    @DisplayName("should delegate to PriceRepositoryPort with correct parameters")
    void shouldDelegateToRepositoryWithCorrectParameters() {
        Price price = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        when(priceRepository.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(List.of(price));

        useCase.findApplicablePrice(APPLICATION_DATE, PRODUCT_35455, BRAND_ZARA);

        verify(priceRepository, times(1))
                .findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE);
        verifyNoMoreInteractions(priceRepository);
    }
}
