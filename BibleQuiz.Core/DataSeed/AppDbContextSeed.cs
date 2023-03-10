using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace BibleQuiz.Core
{
    public class AppDbContextSeed
    {      
        /// <summary>
        /// Method to seed data 
        /// </summary>
        public static async Task SeedDataAsync(ApplicationDbContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                if (!context.ThousandQuizQuestions.Any())
                {
                    // Read the content of the file
                    var thousandQuestions = File.ReadAllText("../BibleQuiz.Core/DataSeed/ThousandQuestions.json");

                    // Deserialize it into a list of thousand questions
                    var questions = JsonSerializer.Deserialize<List<ThousandQuizQuestionsDataModel>>(thousandQuestions);

                    // We loop over the questions and add it to db
                    foreach (var question in questions)
                    {
                        await context.ThousandQuizQuestions.AddAsync(question);
                    }

                    // Save the changes to db
                    await context.SaveChangesAsync();

                }

                if(!context.FesorQuestions.Any())
                {
                    // Read the content from the file
                    var fesorsQuestion = File.ReadAllText("../BibleQuiz.Core/DataSeed/fesor.json");

                    // Deserialize it into a list of fesor questions
                    var questions = JsonSerializer.Deserialize<List<FesorQuestionsDataModel>>(fesorsQuestion);

                    // Loop over the questions and add to db
                    foreach(var question in questions)
                    {
                        // Add the question to db
                        await context.FesorQuestions.AddAsync(question);
                    }

                    // Save the changes to db
                    await context.SaveChangesAsync();
                }

            }

            catch(Exception ex)
            {
                // Create logger
                var logger = loggerFactory.CreateLogger<AppDbContextSeed>();

                // Log error to console
                logger.LogError("An error occurred", ex.Message);
            }
        }
    }
}
