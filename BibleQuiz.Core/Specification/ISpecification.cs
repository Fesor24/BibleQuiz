using System.Linq.Expressions;

namespace BibleQuiz.Core
{
    /// <summary>
    /// ISpecification interface
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface ISpecification<T>
    {
        /// <summary>
        /// Criteria expression which specifies our where condition
        /// </summary>
        Expression<Func<T, bool>> Criteria { get; }
        
        /// <summary>
        /// OrderByDescending expression
        /// </summary>
        Expression<Func<T, object>> OrderByDescending { get; }

        /// <summary>
        /// Order By expression
        /// </summary>
        Expression<Func<T, object>> OrderBy { get; }

        /// <summary>
        /// In any case we have to include navigation props
        /// </summary>
        List<Expression<Func<T, object>>> Includes { get; }

    }
}
