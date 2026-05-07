package com.pricing.unit.application;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pricing.application.usecase.FindApplicablePriceUseCaseImpl;
import com.pricing.domain.exception.PriceNotFoundException;
import com.pricing.domain.model.*;
import com.pricing.domain.port.output.PriceRepositoryPort;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FindApplicablePriceUseCaseImplTest {
    @Mock
    private PriceRepositoryPort priceRepository;

    @InjectMocks
    private FindApplicablePriceUseCaseImpl useCase;

    private static final BrandId BRAND_ZARA = new BrandId(1L);
    private static final ProductId PRODUCT_35455 = new ProductId(35455L);
    private static final LocalDateTime APPLICATION_DATE = LocalDateTime.of(2020, 6, 14, 10, 0, 0);

    private static final DateRange FULL_RANGE =
            new DateRange(LocalDateTime.of(2020, 6, 14, 0, 0, 0), LocalDateTime.of(2020, 12, 31, 23, 59, 59));

    private static final DateRange SHORT_RANGE =
            new DateRange(LocalDateTime.of(2020, 6, 14, 15, 0, 0), LocalDateTime.of(2020, 6, 14, 18, 30, 0));

    private static final Money PRICE_35_50_EUR = new Money(new BigDecimal("35.50"), "EUR");
    private static final Money PRICE_25_45_EUR = new Money(new BigDecimal("25.45"), "EUR");

    @Test
    @DisplayName("should return the price when repository finds the highest priority candidate")
    void shouldReturnPriceWhenRepositoryFindsCandidate() {
        Price expectedPrice = new Price(BRAND_ZARA, PRODUCT_35455, 1, FULL_RANGE, 0, PRICE_35_50_EUR);
        when(priceRepository.findHighestPriorityPrice(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(Optional.of(expectedPrice));

        Price result = useCase.findApplicablePrice(APPLICATION_DATE, PRODUCT_35455, BRAND_ZARA);

        assertSame(expectedPrice, result);
        verify(priceRepository).findHighestPriorityPrice(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE);
    }

    @Test
    @DisplayName("should return the highest priority price resolved by the database")
    void shouldReturnHighestPriorityPriceResolvedByDatabase() {
        Price highPriority = new Price(BRAND_ZARA, PRODUCT_35455, 2, SHORT_RANGE, 1, PRICE_25_45_EUR);
        when(priceRepository.findHighestPriorityPrice(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(Optional.of(highPriority));

        Price result = useCase.findApplicablePrice(APPLICATION_DATE, PRODUCT_35455, BRAND_ZARA);

        assertEquals(1, result.getPriority());
        assertEquals(PRICE_25_45_EUR, result.getMoney());
        assertEquals(2, result.getPriceList());
    }

    @Test
    @DisplayName("should throw PriceNotFoundException when repository returns empty")
    void shouldThrowPriceNotFoundExceptionWhenNoCandidates() {
        when(priceRepository.findHighestPriorityPrice(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(Optional.empty());

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
        when(priceRepository.findHighestPriorityPrice(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE))
                .thenReturn(Optional.of(price));

        useCase.findApplicablePrice(APPLICATION_DATE, PRODUCT_35455, BRAND_ZARA);

        verify(priceRepository, times(1)).findHighestPriorityPrice(BRAND_ZARA, PRODUCT_35455, APPLICATION_DATE);
        verifyNoMoreInteractions(priceRepository);
    }
}
